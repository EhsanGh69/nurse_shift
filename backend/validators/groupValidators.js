const Joi = require('joi');

const shiftKeys = ["M", "E", "N", "CS"]

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

exports.createSubGroupSchema = Joi.object({
    groupId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    order: Joi.number().required(),
    shiftCount: Joi.object().keys(
        Object.fromEntries(shiftKeys.map(key => [key, Joi.number().required()]))
    ).required()
})

exports.addSubGroupMemberSchema = Joi.object({
    groupId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    order: Joi.number().required(),
    memberId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    rank: Joi.number().required()
})