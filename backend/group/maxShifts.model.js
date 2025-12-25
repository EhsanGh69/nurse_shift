const mongoose = require("mongoose");

const maxCountsSchema = new mongoose.Schema({
    M: { type: Number, default: 0 },
    E: { type: Number, default: 0 },
    N: { type: Number, default: 0 },
    CS: { type: Number, default: 0 }
}, { _id: false })

const memberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    isMutable: {
        type: Boolean,
        default: false
    },
    maxCounts: maxCountsSchema
}, { _id: false })

const maxShiftsSchema = new mongoose.Schema({
    group: { 
        type: mongoose.Types.ObjectId, 
        ref: "Group", 
        required: true 
    },
    members: {
        type: [memberSchema],
        default: []
    }
})

const maxShiftsModel = mongoose.model('MaxShifts', maxShiftsSchema);

module.exports = maxShiftsModel;