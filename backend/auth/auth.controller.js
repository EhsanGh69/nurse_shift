const jwt = require("jsonwebtoken");

const userModel = require('../user/user.model');
const blockUserModel = require("../user/blockUser.model");
const { generateAccessToken, generateRefreshToken } = require('../utils/token');




const clearCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
}


exports.register = async (req, res) => {
    // validation

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


exports.resetPassword = async (req, res) => {
    // validation

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
    // validation

    const { nationalCode } = req.body;
    let verifyPassword = false;

    const user = await userModel.findOne({ nationalCode })

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