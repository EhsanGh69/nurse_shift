const jwt = require("jsonwebtoken");

const userModel = require('../user/user.model');
const blockUserModel = require("../user/blockUser.model");
const activationCodeModel = require('./activationCode.model')
const registerValidation = require('../validators/register');
const loginValidation = require('../validators/login');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const { activateValidation, resendValidation } = require("../validators/activation")
const generateActivationCode = require("../utils/activationCode")
const { resetPasswordValidator } = require("../validators/changePassword");


const clearCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
}


exports.register = async (req, res) => {
    const validationResult = registerValidation(req.body)
    if (validationResult !== true) {
        return res.status(422).json(validationResult)
    }

    const { username, email, password, firstName, lastName } = req.body;

    const userExist = await userModel.findOne({
        $or: [{ username }, { email }]
    })
    if (userExist) {
        return res.status(409).json({ message: "username or email already exist" })
    }

    const usersCount = await userModel.countDocuments()

    const newUser = await userModel.create({
        username,
        email,
        password,
        firstName,
        lastName,
        role: usersCount > 0 ? "USER" : "ADMIN",
        isActive: false
    })

    await generateActivationCode(newUser, res)

    res.status(201).json({ message: 'You registered successfully. Activation code sent to your email' })

}

exports.activateAndForgotCode = async (req, res) => {
    let messageKeyWord = ''
    if (req.url.includes("forgot_code")) messageKeyWord = 'Reset password'
    else messageKeyWord = 'Activation'
        
    const validationResult = activateValidation(req.body)
    if (validationResult !== true) {
        return res.status(422).json(validationResult);
    }

    const userEmail = req.cookies["user-email"]
    if (!userEmail) {
        return res.status(400).json({ message: `${messageKeyWord} failed!` })
    }

    const user = await userModel.findOne({ email: userEmail })
    if(!user) return res.status(404).json({ message: "User not found!" });

    const { code } = req.body

    const activationCode = await activationCodeModel.findOne({ userId: user._id, code })
    if (!activationCode) {
        return res.status(400).json({ message: `${messageKeyWord} code is not valid!` })
    }

    const now = new Date()
    if ((activationCode.expiresAt < now)) {
        await activationCode.deleteOne()
        res.clearCookie("user-email", clearCookieOptions)
        return res.status(400).json({ message: `Your ${messageKeyWord} code has been expired!` })
    }
    
    await activationCode.deleteOne()

    if (req.url.includes("forgot_code")) {
        return res.status(301).json({ message: "Redirect to reset password" })
    } else {
        res.clearCookie("user-email", clearCookieOptions)
        user.isActive = true;
        await user.save()
        return res.json({ message: "Your account activated successfully" })
    }
}

exports.resendActivationAndForgotPassword = async (req, res) => {
    const validationResult = resendValidation(req.body)
    if (validationResult !== true) {
        return res.status(422).json(validationResult);
    }

    const { email } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(404).json({ message: "There is no user with this email!" })
    }

    await activationCodeModel.deleteMany({ userId: user._id })

    if (req.url.includes("forgot_password")) {
        const checkBlock = await blockUserModel.findOne({ user: user._id })
        if(checkBlock) return res.status(403).json({ message: "Your account is blocked by admin" });

        const refreshToken = req.cookies["refresh-token"]
        if (refreshToken) {
            return res.status(400).json({ message: "You already logged in!" })
        }
        
        await generateActivationCode(user, res, 'forgot')
        return res.json({ message: 'Forgot password code sent to your email' })
    } else {
        if (user.isActive) {
            return res.status(400).json({ message: "Your account has already been activated" })
        }

        await generateActivationCode(user, res, 'activate')
        return res.json({ message: 'New activation code sent to your email' })
    }
}

exports.resetPassword = async (req, res) => {
    const validationResult = resetPasswordValidator(req.body)
    if (validationResult !== true) {
        return res.status(422).json(validationResult);
    }

    const userEmail = req.cookies["user-email"]
    if (!userEmail) {
        return res.status(400).json({ message: 'Reset password failed!' })
    }

    const { newPassword } = req.body;

    const user = await userModel.findOne({ email: userEmail });
    if(!user){
        return res.status(404).json({ message: 'User not found!' })
    }

    user.password = newPassword;
    await user.save()

    res.json({ message: "Your password reset successfully"})

}


exports.login = async (req, res) => {
    const validationResult = loginValidation(req.body)
    if (validationResult !== true) {
        return res.status(422).json(validationResult)
    }

    const { identifier, password } = req.body;
    let verifyPassword = false;

    const user = await userModel.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    })

    if (user) {
        if (!user.isActive) return res.status(400).json({ message: "Your account is not active" });

        const checkBlock = await blockUserModel.findOne({ user: user._id })
        if(checkBlock) return res.status(403).json({ message: "Your account is blocked by admin" });

        verifyPassword = await user.verifyPassword(password)
    }

    if (!user || !verifyPassword) {
        return res.status(401).json({ message: "Your credentials is not provided" })
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("access-token", accessToken, { httpOnly: true });
    res.cookie("refresh-token", refreshToken, { httpOnly: true });

    await userModel.findByIdAndUpdate(user._id, {
        $set: { refreshToken, lastLogin: Date.now() }
    })

    return res.json({ message: "You are logged in successfully!" })
}

exports.logout = async (req, res) => {
    const refreshToken = req.cookies["refresh-token"]
    if (refreshToken) {
        const user = await userModel.findOne({ refreshToken })
        if (user) {
            user.refreshToken = '';
            await user.save();
        }
    }

    res.clearCookie("access-token", clearCookieOptions)
    res.clearCookie("refresh-token", clearCookieOptions)

    return res.json({ message: "You logged out successfully!" })
}

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies["refresh-token"]
    if (!refreshToken) {
        return res.status(401).json({ message: "You don't have refresh token" })
    }

    const user = await userModel.findOne({ refreshToken })
    if (!user) {
        return res.status(403).json({ message: "Your access has been blocked!" })
    }

    const checkBlock = await blockUserModel.findOne({ user: user._id })
    if(checkBlock) return res.status(403).json({ message: "Your account is blocked by admin" });

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const newAccessToken = generateAccessToken(user._id)
        res.cookie("access-token", newAccessToken, { httpOnly: true })
        return res.json({ accessToken: newAccessToken })
    } catch (error) {
        return res.status(401).json({ message: "Your refresh token has expired!" })
    }
}