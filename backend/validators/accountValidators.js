const Joi = require('joi');

exports.changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(/^(?=.*[a-zA-Z0-9]).{8,}$/).required()
})