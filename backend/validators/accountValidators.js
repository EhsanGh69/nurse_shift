const Joi = require('joi');

exports.changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(/^(?=.*[a-zA-Z0-9]).{8,}$/).required()
})

exports.editAccountSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    mobile: Joi.string().pattern(/^09\d{9}$/).required(),
    avatar: Joi.any().allow(null).optional()
})