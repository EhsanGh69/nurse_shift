const { Router } = require('express');

const authController = require("./auth.controller")

const authRouter = Router();

authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logout)
authRouter.post('/refresh_token', authController.refreshToken)
authRouter.post('/activate', authController.activateAndForgotCode)
authRouter.post('/resend_activation', authController.resendActivationAndForgotPassword)
authRouter.post('/forgot_password', authController.resendActivationAndForgotPassword)
authRouter.post('/forgot_code', authController.activateAndForgotCode)
authRouter.post('/reset_password', authController.resetPassword)

module.exports = authRouter;