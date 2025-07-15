const userModel = require("../user/user.model")

module.exports = function (roles) {
    return async (req, res, next) => {
        const user = await userModel.findById(req.user._id)

        if (roles.includes(user.role)) return next();

        return res.status(403).json({ error: "Your permission is denied!" })
    }
} 