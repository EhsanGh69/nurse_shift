const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true })

const activationCodeModel = mongoose.model('ActivationCode', schema)

module.exports = activationCodeModel;