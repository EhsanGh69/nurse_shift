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

app.use('/api/auth', authRouter)
app.use('/api/account', accountRouter)
app.use('/api/groups', groupRouter)
app.use('/api/messages', messageRouter)
app.use('/api/api/settings', settingRouter)
app.use('/api/polls', pollRouter)
app.use('/api/shifts', shiftRouter)
app.use('/api/schedule', scheduleRouter)
app.use('/api/json', jsonRouter)

app.use(notFoundErrorHandler);
// app.use(serverErrorHandler);

module.exports = app;