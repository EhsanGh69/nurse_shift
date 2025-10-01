const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    rank: {
        type: Number,
        required: true
    }
}, { _id: false })

const shiftCountSchema = new mongoose.Schema({
    M: { type: Number, default: 0 },
    E: { type: Number, default: 0 },
    N: { type: Number, default: 0 },
    CS: { type: Number, default: 0 }
}, { _id: false })

const subSchema = new mongoose.Schema({
    order: { type: Number, required: true },
    shiftCount: shiftCountSchema,
    members: {
        type: [memberSchema],
        default: []
    }
}, { _id: false })

const subGroupSchema = new mongoose.Schema({
    group: { 
        type: mongoose.Types.ObjectId, 
        ref: "Group", 
        required: true 
    },
    subs: {
        type: [subSchema],
        default: []
    }
})

const subGroupModel = mongoose.model('SubGroup', subGroupSchema);

module.exports = subGroupModel;