const mongoose = require("mongoose");

const shiftSettingSchema = new mongoose.Schema({
    group: {
        type: mongoose.Types.ObjectId,
        ref: "Group",
        required: true
    },
    personCount: {
        type: Map,
        of: Number
    },
    hourCount: {
        type: Map,
        of: Number
    },
    dayLimit: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('ShiftSetting', shiftSettingSchema);