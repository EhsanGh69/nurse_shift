const jwt = require("jsonwebtoken");

exports.generateAccessToken = (id) => {
    const token = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "60m"
    })
    return token;
}

exports.generateRefreshToken = (id) => {
    const token = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "30d"
    })
    return token;
}


