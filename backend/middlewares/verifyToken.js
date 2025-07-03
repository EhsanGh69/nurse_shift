const jwt = require("jsonwebtoken");

const userModel = require("../user/user.model");


module.exports = async (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
        try {
            const accessTokenPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            const user = await userModel.findById(accessTokenPayload.id)
            if (!user) return res.status(404).json({ message: "User not found" })
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Your token has expired" })
        }
    } else {
        return res.status(401).json({ message: "You don't have access to this route" })
    }
}