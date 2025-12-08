const jwt = require("jsonwebtoken");

const userModel = require("../user/user.model");


module.exports = async (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1];

   if(!token) return res.status(401).json({ message: "لطفا وارد شوید یا ثبت نام کنید" })
    
    try {
        const accessTokenPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await userModel.findById(accessTokenPayload.id)
        if (!user) return res.status(404).json({ error: "User not found" })
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Your token has expired" })
    }
}