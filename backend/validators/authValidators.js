const Joi = require('joi');

exports.nurseRegisterSchema = Joi.object({
    inviteCode: Joi.string().required(),
    nationalCode: Joi.string().pattern(/^(?!^(\d)\1{9}$)\d{10}$/).required(),
    password: Joi.string().pattern(/^(?=.*[a-zA-Z0-9]).{8,}$/).required()
})

exports.matronRegisterSchema = Joi.object({
    firstName: Joi.string().min(3).max(150).required(),
    lastName: Joi.string().min(3).max(150).required(),
    password: Joi.string().pattern(/^(?=.*[a-zA-Z0-9]).{8,}$/).required(),
    mobile: Joi.string().pattern(/^09\d{9}$/).required(),
    nationalCode: Joi.string().pattern(/^(?!^(\d)\1{9}$)\d{10}$/).required(),
    province: Joi.string().required(),
    county: Joi.string().required(),
    hospital: Joi.string().required(),
    department: Joi.string().required()
})

exports.loginSchema = Joi.object({
    nationalCode: Joi.string().required(),
    password: Joi.string().required()
})

