const blockUserModel = require("../user/blockUser.model");

const clearCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
}

module.exports = async (req, res, next) => {
    const user = req.user;

    const checkBlock = await blockUserModel.findOne({ user: user._id });
    if(checkBlock) {
        res.clearCookie("access-token", clearCookieOptions)
        res.clearCookie("refresh-token", clearCookieOptions)
        return res.status(403).json({ message: "Your account is blocked by admin" })
    }
    next();
}
