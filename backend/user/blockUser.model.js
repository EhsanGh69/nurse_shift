const mongoose = require("mongoose");

const blockUserSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const blockUserModel = mongoose.model('BlockUser', blockUserSchema);

module.exports = blockUserModel;