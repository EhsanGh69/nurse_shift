const Joi = require('joi');

exports.newMessageSchema = Joi.object({
    content: Joi.string().required(),
    mobile: Joi.string().pattern(/^09\d{9}$/).required()
})

exports.responseMessageSchema = Joi.object({
    content: Joi.string().required()
})

exports.seenMessageSchema = Joi.object({
    ids: Joi.array().items(
        Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
    ).min(1).required()
})