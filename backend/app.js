const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require('cors')
require("dotenv").config();

const { notFoundErrorHandler, serverErrorHandler } = require('./middlewares/handleError');
const authRouter = require("./auth/auth.router");
const accountRouter = require("./account/account.router");
const groupRouter = require("./group/group.router");
const messageRouter = require("./message/message.router");
const settingRouter = require("./setting/setting.router");
const pollRouter = require("./poll/poll.router");
const shiftRouter = require("./shift/shift.router");
const scheduleRouter = require("./schedule/schedule.router");
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
app.use('/schedule', scheduleRouter)
app.use('/json', jsonRouter)

app.use(notFoundErrorHandler);
// app.use(serverErrorHandler);

module.exports = app;