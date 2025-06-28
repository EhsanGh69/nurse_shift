const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require('cors')
require("dotenv").config();

const authRouter = require("./auth/auth.router");


const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())
app.use(cookieParser("ghgnkjiredrserserseok"))
app.use('/images/avatars', express.static(path.join(__dirname, "public", "images", "avatars")))

app.use('/auth', authRouter)


// app.get('/test', (req, res) => {
// })

// 404 handler
app.use((req, res, next) => {
    return res.status(404).json({
      error: {
        message: "404 | Not Found!",
      },
    });
});


// 500 handler
app.use((err, req, res, next) => {
    return res.status(500).json({
        message: err.message || "Server Error !!",
    });
});


module.exports = app;