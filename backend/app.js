const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRouter = require("./auth/auth.router");
const accountRouter = require("./account/account.router");
const authorRouter = require("./account/author.router");
const blogRouter = require("./blog/blog.router");
const categoryRouter = require("./category/category.router");
const postRouter = require("./post/post.router");
const userRouter = require("./user/user.router");

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cookieParser("ghgnkjiredrserserseok"))
app.use('/images/avatars', express.static(path.join(__dirname, "public", "images", "avatars")))
app.use('/images/posts', express.static(path.join(__dirname, "public", "images", "posts")))

app.use('/auth', authRouter)
app.use('/account', accountRouter)
app.use('/account/author', authorRouter)
app.use('/blog', blogRouter)
app.use('/categories', categoryRouter)
app.use('/posts', postRouter)
app.use('/users', userRouter)


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