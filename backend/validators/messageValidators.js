const Joi = require('joi');

exports.newMessageSchema = Joi.object({
    content: Joi.string().required(),
    mobile: Joi.string().pattern(/^09\d{9}$/).required()
})