const Joi = require("joi");

// shift days:
// M --> Morning (non holiday)
// MH --> Morning Holiday

// person count:
// MH --> Morning Holiday

// hour count:
// NPM --> Non Promotion Morning
// PM --> Promotion Morning (non holiday)
// PMH --> Promotion Morning Holiday

const shiftDaysKeys = [
    "M", "E", "N", "OFF", "V", "ME", "MN", "NE", "EN", "NM", "NME", "MEN",
    "MH", "EH", "NH", "MEH", "MNH", "NEH", "ENH", "NMH", "NMEH", "MENH"
]
const personSettingKeys = ["M", "E", "N", "MH", "EH", "NH"]
const hourSettingKeys = ["NPM", "NPE", "NPN", "PM", "PE", "PN"]


const keysValidator = (value, validKeys, helpers) => {
    const keys = Object.keys(value)
    const invalidKeys = keys.filter(key => !validKeys.includes(key))
    if (invalidKeys.length) {
        return helpers.error("any.invalid", { message: `invalid keys: ${invalidKeys.join(", ")}` })
    }
    return value;
}

exports.saveShiftSchema = Joi.object({
    groupId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    shiftDays: Joi.object().keys(
        Object.fromEntries(
            shiftDaysKeys.map(key => [
                key, Joi.array().items(Joi.number().integer().min(1).max(31).required())
            ])
        )
    ).required().custom((value, helpers) => keysValidator(value, shiftDaysKeys, helpers)),
    month: Joi.string().required(),
    year: Joi.string().required()
})

exports.createShiftSchema = Joi.object({
    groupId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    shiftDays: Joi.object().keys(
        Object.fromEntries(
            shiftDaysKeys.map(key => [
                key, Joi.array().items(Joi.number().integer().min(1).max(31).required())
            ])
        )
    ).required().custom((value, helpers) => keysValidator(value, shiftDaysKeys, helpers)),
    favCS: Joi.string().pattern(/^(ME|MN|NE|EN|NM|NME|MEN|MH|EH|NH|MEH|MNH|NEH|ENH|NMH|NMEH|MENH)$/).allow(""),
    month: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().allow("")
})

exports.updateShiftSchema = Joi.object({
    groupId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    shiftDay: Joi.object().keys(
        Object.fromEntries(
            ["current", "update"].map(key => [
                key, Joi.string()
                    .pattern(/^(M|E|N|OFF|V|ME|MN|NE|EN|NM|NME|MEN|MH|EH|NH|MEH|MNH|NEH|ENH|NMH|NMEH|MENH)([1-9]|[12]\d|3[01])$/)
                    .required()
            ])
        )
    ).required()
})

exports.rejectShiftDaySchema = Joi.object({
    groupId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    shiftDay: Joi.string()
    .pattern(/^(M|E|N|OFF|V|ME|MN|NE|EN|NM|NME|MEN|MH|EH|NH|MEH|MNH|NEH|ENH|NMH|NMEH|MENH)([1-9]|[12]\d|3[01])$/)
    .required()
})

exports.refreshShiftsTableSchema = Joi.object({
    groupId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    month: Joi.string().required(),
    year: Joi.string().required()
})

exports.shiftSettingSchema = Joi.object({
    groupId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    personCount: Joi.object().keys(
        Object.fromEntries(
            personSettingKeys.map(key => [ key, Joi.number().integer().required() ])
        )
    ).required().custom((value, helpers) => keysValidator(value, personSettingKeys, helpers)),
    hourCount: Joi.object().keys(
        Object.fromEntries(
            hourSettingKeys.map(key => [ key, Joi.number().required() ])
        )
    ).required().custom((value, helpers) => keysValidator(value, hourSettingKeys, helpers)),
    dayLimit: Joi.number().integer().max(31).required()
})

exports.jobInfoSchema = Joi.object({
    userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    groupId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    post: Joi.number().integer().required(),
    employment: Joi.number().integer().required(),
    experience: Joi.number().integer().required(),
    hourReduction: Joi.number().integer().required(),
    promotionDuty: Joi.number().integer().required(),
    nonPromotionDuty: Joi.number().integer().required()
})
