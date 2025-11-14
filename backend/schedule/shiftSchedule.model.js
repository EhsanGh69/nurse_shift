const mongoose = require("mongoose")


const dailyShiftsSchema = new mongoose.Schema({
    0: {
        type: Number,
        required: true,
        min: 1,
        max: 31
    },
    1: {
        type: String,
        required: true
    }
}, { _id: false })


const monthScheduleSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    monthShifts: {
        type: [
            {
                type: dailyShiftsSchema,
                required: false
            }
        ]
    }
}, { _id: false })


const shiftScheduleSchema = new mongoose.Schema({
    group: { 
        type: mongoose.SchemaTypes.ObjectId, 
        ref: "Group", 
        required: true 
    },
    monthSchedule: {
        type: [monthScheduleSchema],
        default: []
    }
})

const shiftScheduleModel = mongoose.model('shiftSchedule', shiftScheduleSchema);

module.exports = shiftScheduleModel;

