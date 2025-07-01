const blockUserModel = require("../user/blockUser.model");

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
}

module.exports = async (req, res, next) => {
    const user = req.user;

    const checkBlock = await blockUserModel.findOne({ user: user._id });
    if(checkBlock) {
        res.clearCookie("access-token", cookieOptions)
        res.clearCookie("refresh-token", cookieOptions)
        return res.status(403).json({ message: "Your account is blocked by admin" })
    }
    next();
}
