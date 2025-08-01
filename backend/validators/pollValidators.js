const Joi = require("joi");


exports.createPollSchema = Joi.object({
    opinion: Joi.string().min(5).required()
})