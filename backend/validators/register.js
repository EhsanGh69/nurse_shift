const Joi = require('joi');

const registerSchema = Joi.object({
    firstName: Joi.string().min(3).max(150).required(),
    lastName: Joi.string().min(3).max(150).required(),
    inviteCode: Joi.string().required(),
    password: Joi.string().pattern(/^(?=.*[a-zA-Z0-9]).{8,}$/).required(),
    mobile: Joi.string().pattern(/^09\d{9}$/).required(),
    nationalCode: Joi.string().pattern(/^(?!^(\d)\1{9}$)\d{10}$/).required(),
    province: Joi.string().required(),
    county: Joi.string().required()
})