const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const multer = require("multer");
require("dotenv").config();

const authRouter = require("./auth/auth.router");
const accountRouter = require("./account/account.router");
const groupRouter = require("./group/group.router");
const messageRouter = require("./message/message.router");
const settingRouter = require("./setting/setting.router");
const pollRouter = require("./poll/poll.router");
const shiftRouter = require("./shift/shift.router");
const jsonRouter = require("./json/json.router");


const app = express();

app.use(cors({ origin: "http://localhost:8000", credentials: true }))
app.use(cookieParser("ghgnkjiredrsedfxhbfdbrserseok"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use('/images/avatars', express.static(path.join(__dirname, "public", "images", "avatars")))

app.use('/auth', authRouter)
app.use('/account', accountRouter)
app.use('/groups', groupRouter)
app.use('/messages', messageRouter)
app.use('/settings', settingRouter)
app.use('/polls', pollRouter)
app.use('/shifts', shiftRouter)
app.use('/json', jsonRouter)


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
  if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "حجم فایل بیش از حد مجاز است" });
    }
  if (err.message === 'File type is not valid') {
      return res.status(400).json({ message: "نوع فایل نامعتبر می باشد" });
    }
   
    return res.status(500).json({ error: err.message || 'Server Error' });
});


module.exports = app;