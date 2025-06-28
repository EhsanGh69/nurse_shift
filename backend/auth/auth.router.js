const { Router } = require('express');

const authController = require("./auth.controller")

const authRouter = Router();

authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logout)
authRouter.post('/refresh_token', authController.refreshToken)
authRouter.post('/reset_password', authController.resetPassword)

module.exports = authRouter;