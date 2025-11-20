const Joi = require("joi");

exports.updateShiftScheduleSchema = Joi.object({
    groupId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    memberId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    shiftDay: Joi.number().integer().min(1).max(31).required(),
    shiftType: Joi.string()
        .pattern(/^(M|E|N|OFF|V|ME|MN|EN|NM|NME|MEN|MH|EH|NH|MEH|MNH|NEH|ENH|NMH|NMEH|MENH)$/)
        .required()
})

exports.refreshShiftsTableSchema = Joi.object({
    groupId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    month: Joi.string().required(),
    year: Joi.string().required()
})