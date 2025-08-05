const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    group: {
        type: mongoose.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    shiftDays: {
        type: Map,
        of: [Number]
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    rejects: {
        type: [String],
        default: []
    },
    expired: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }) 

module.exports = mongoose.model('Shift', shiftSchema)