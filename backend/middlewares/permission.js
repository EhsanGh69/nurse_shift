const userModel = require("../user/user.model")

module.exports = function (roles) {
    return async (req, res, next) => {
        const user = await userModel.findById(req.user._id)

        if (user.isActive && roles.includes(user.role)) return next();

        return res.status(403).json({ message: "Your permission is denied!" })
    }
} 