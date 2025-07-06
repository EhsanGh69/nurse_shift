const jwt = require("jsonwebtoken");

const userModel = require('../user/user.model');
const groupModel = require('../user/group.model');
const blockUserModel = require("../user/blockUser.model");
const inviteCodeModel = require("../matron/inviteCode.model");
const { generateAccessToken, generateRefreshToken } = require('../utils/token');


exports.nurseRegister = async (req, res) => {
    const {firstName, lastName, password, mobile, nationalCode, inviteCode} = req.body;

    const userExist = await userModel.findOne({
        $or: [{ mobile }, { nationalCode }]
    })
    if (userExist)
        return res.status(409).json({ message: "کاربری با مشخصات وارد شده از قبل وجود دارد" })

    const foundInviteCode = await inviteCodeModel.findOne({ mobile, code: inviteCode });
    if(!foundInviteCode)
        return res.status(400).json({ message: "کد دعوت یا شماره همراه نادرست است" })

    const nurse = await userModel.create({
        password,
        firstName,
        lastName,
        mobile,
        nationalCode,
        role: "NURSE" 
    })

    await groupModel.findByIdAndUpdate(foundInviteCode.group, {
        $push: { members: nurse._id }
    })

    await foundInviteCode.deleteOne()

    res.status(201).json({ message: 'You registered successfully' })
}

exports.matronRegister = async (req, res) => {
    const { password, firstName, lastName, mobile, nationalCode, 
        province, county, hospital, department} = req.body;

    const userExist = await userModel.findOne({
        $or: [{ mobile }, { nationalCode }]
    })

    if (userExist)
        return res.status(409).json({ message: "کاربری با مشخصات وارد شده از قبل وجود دارد" })

    const matron = await userModel.create({
        password,
        firstName,
        lastName,
        mobile,
        nationalCode,
        role: "MATRON"
    })

    await groupModel.create({ matron: matron._id, province, county, hospital, department })

    res.status(201).json({ message: 'You registered successfully' })
}


exports.resetPassword = async (req, res) => {
    // validation

    const { newPassword } = req.body;

    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
        return res.status(404).json({ message: 'User not found!' })
    }

    user.password = newPassword;
    await user.save()

    res.json({ message: "Your password reset successfully" })

}

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
}

exports.login = async (req, res) => {
    const { nationalCode, password } = req.body;
    let verifyPassword = false;

    const user = await userModel.findOne({ nationalCode })

    if (user) {
        const checkBlock = await blockUserModel.findOne({ user: user._id })
        if (checkBlock) return res.status(403).json({ message: "حساب کاربری شما مسدود شده است" });

        verifyPassword = await user.verifyPassword(password)
    }

    if (!user || !verifyPassword) {
        return res.status(401).json({ message: "کد ملی یا رمز عبور اشتباه وارد شده است" })
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("access-token", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie("refresh-token", refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });

    await userModel.findByIdAndUpdate(user._id, {
        $set: { refreshToken, lastLogin: Date.now() }
    })

    return res.json({ role: user.role })
}

exports.logout = async (req, res) => {
    res.clearCookie("access-token", cookieOptions)
    res.clearCookie("refresh-token", cookieOptions)

    const refreshToken = req.cookies["refresh-token"]
    if (refreshToken) {
        const user = await userModel.findOne({ refreshToken })
        if (user) {
            user.refreshToken = '';
            await user.save();
        }
    }

    return res.json({ message: "You logged out successfully!" })
}

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies["refresh-token"]
    if (!refreshToken) {
        return res.status(401).json({ message: "You don't have refresh token" })
    }

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await userModel.findOne({ refreshToken })
        if (!user) {
            return res.status(403).json({ message: "Your access has been blocked!" })
        }

        const checkBlock = await blockUserModel.findOne({ user: user._id })
        if (checkBlock) return res.status(403).json({ message: "Your account is blocked by admin" });

        const newAccessToken = generateAccessToken(user._id)
        res.cookie("access-token", newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
        return res.json({ accessToken: newAccessToken })
    } catch (error) {
        res.clearCookie("access-token", cookieOptions)
        res.clearCookie("refresh-token", cookieOptions)
        return res.status(401).json({ message: "Your refresh token has expired!" })
    }
}

exports.getMe = async (req, res) => {
    const refreshToken = req.cookies["refresh-token"]
    if (!refreshToken) {
        return res.status(401).json({ message: "You don't have refresh token" })
    }

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await userModel.findOne({ refreshToken })
            .select("avatar firstName lastName mobile role nationalCode county province")

        if (!user)
            return res.status(403).json({ message: "Your access has been blocked!" })

        return res.json(user)
    } catch (error) {
        res.clearCookie("access-token", cookieOptions)
        res.clearCookie("refresh-token", cookieOptions)
        return res.status(401).json({ message: "Your refresh token has expired!" })
    }
}