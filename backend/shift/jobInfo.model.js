const mongoose = require("mongoose");

const jobInfoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    group: {
        type: mongoose.Types.ObjectId,
        ref: "Group",
        required: true
    },
    post: {
        type: Number,
        required: true
    },
    employment: {
        type: Number,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    hourReduction: {
        type: Number,
        required: true
    },
    promotionDuty: {
        type: Number,
        required: true
    },
    nonPromotionDuty: {
        type: Number,
        required: true
    },
    shiftManager: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('JobInfo', jobInfoSchema);