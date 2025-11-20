const jwt = require("jsonwebtoken");

exports.generateAccessToken = (id) => {
    const token = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        // expiresIn: "60m"
        expiresIn: "1d"
    })
    return token;
}

exports.generateRefreshToken = (id) => {
    const token = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "30d"
    })
    return token;
}


