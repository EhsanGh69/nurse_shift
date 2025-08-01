const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fontFamily: {
        type: String,
        enum: ['Vazir', 'Tanha', 'Parastoo'],
        default: 'Vazir'
    },
    fontSize: {
        type: Number,
        min: 16,
        max: 24,
        default: 16
    },
    themeMode: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    }
})


module.exports = mongoose.model('Setting', settingSchema)