const Joi = require('joi');

exports.changeSettingSchema = Joi.object({
    fontFamily: Joi.string().valid("Vazir", "Tanha", "Parastoo").required(),
    fontSize: Joi.number().min(16).max(24).required(),
    themeMode: Joi.string().valid("light", "dark").required()
})