const Joi = require('joi');

exports.inviteCodeSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    mobile: Joi.string().pattern(/^09\d{9}$/).required(),
    groupId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
})

exports.createGroupSchema = Joi.object({
    province: Joi.string().required(),
    county: Joi.string().required(),
    hospital: Joi.string().required(),
    department: Joi.string().required()
})