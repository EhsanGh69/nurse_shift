const jwt = require("jsonwebtoken");

const userModel = require('../user/user.model');
const groupModel = require('../group/group.model');
const blockUserModel = require("../user/blockUser.model");
const inviteCodeModel = require("../group/inviteCode.model");
const settingModel = require("../setting/setting.model");
const subGroupModel = require("../group/subGroup.model");
const shiftScheduleModel = require("../schedule/shiftSchedule.model")
const { generateAccessToken, generateRefreshToken } = require('../utils/token');


exports.nurseRegister = async (req, res) => {
    const {password, username, inviteCode} = req.body;

    const foundInviteCode = await inviteCodeModel.findOne({ code: inviteCode });
    if(!foundInviteCode)
        return res.status(400).json({ message: "کد دعوت وارد شده نادرست است" })

    const userExist = await userModel.findOne({ username })
    if (userExist)
        return res.status(409).json({ message: "نام کاربری وارد شده از قبل وجود دارد" })

    const nurse = await userModel.create({
        password,
        firstName: foundInviteCode.firstName,
        lastName: foundInviteCode.lastName,
        mobile: foundInviteCode.mobile,
        username,
        role: "NURSE" 
    })

    await groupModel.findByIdAndUpdate(foundInviteCode.group, {
        $push: { members: nurse._id }
    })

    await foundInviteCode.deleteOne()

    await settingModel.create({ user: nurse._id })

    res.status(201).json({ message: 'You registered successfully' })
}

exports.matronRegister = async (req, res) => {
    const { password, firstName, lastName, mobile, username, 
        province, county, hospital, department} = req.body;

    const userExist = await userModel.findOne({
        $or: [{ mobile }, { username }]
    })

    if (userExist)
        return res.status(409).json({ message: "کاربری با مشخصات وارد شده از قبل وجود دارد" })

    const matron = await userModel.create({
        password,
        firstName,
        lastName,
        mobile,
        username,
        role: "MATRON"
    })

    const group = await groupModel.create({ matron: matron._id, province, county, hospital, department })

    await settingModel.create({ user: matron._id })
    await subGroupModel.create({ group: group._id })
    await shiftScheduleModel.create({ group: group._id })

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
    const { username, password } = req.body;
    let verifyPassword = false;
    
    // const user = await userModel.findOne({ username })
    const user = await userModel.findOne({ nationalCode: username })

    if (user) {
        const checkBlock = await blockUserModel.findOne({ user: user._id })
        if (checkBlock) return res.status(403).json({ message: "حساب کاربری شما مسدود شده است" });

        verifyPassword = await user.verifyPassword(password)
    }

    if (!user || !verifyPassword) {
        return res.status(401).json({ message: "نام کاربری یا رمز عبور اشتباه وارد شده است" })
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("access-token", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie("refresh-token", refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });

    await userModel.findByIdAndUpdate(user._id, {
        $set: { refreshToken, lastLogin: Date.now() }
    })

    return res.json({ role: user.role, refreshToken })
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
    if (!refreshToken) 
        return res.status(401).json({ message: "لطفا وارد شوید یا ثبت نام کنید" })
    
    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await userModel.findOne({ refreshToken })
        if (!user) {
            return res.status(403).json({ error: "Your access has been blocked!" })
        }

        const checkBlock = await blockUserModel.findOne({ user: user._id })
        if (checkBlock) return res.status(403).json({ message: "حساب کاربری شما مسدود است" });

        const newAccessToken = generateAccessToken(user._id)
        res.cookie("access-token", newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
        return res.json({ accessToken: newAccessToken })
    } catch (error) {
        return res.status(401).json({ error: "Your refresh token has expired!" })
    }
}

exports.getMe = async (req, res) => {
    const refreshToken = req.cookies["refresh-token"]
    
    if (!refreshToken) 
        return res.status(401).json({ message: "لطفا وارد شوید یا ثبت نام کنید" })

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await userModel.findOne({ refreshToken })
            .select("avatar firstName lastName mobile role username")

        if (!user)
            return res.status(403).json({ error: "Your access has been blocked!" })
        
        return res.json(user)
    } catch (error) {
        return res.status(401).json({ error: "Your refresh token has expired!" })
    }
}