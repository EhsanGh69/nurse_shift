const { Router } = require('express');

const authController = require("./auth.controller");
const validate = require('../middlewares/joiValidator');
const { registerSchema, loginSchema } = require('../validators/authValidators');

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.register)
authRouter.post('/login', validate(loginSchema), authController.login)
authRouter.post('/logout', authController.logout)
authRouter.post('/refresh_token', authController.refreshToken)
authRouter.post('/reset_password', authController.resetPassword)
authRouter.get('/me', authController.getMe)

module.exports = authRouter;