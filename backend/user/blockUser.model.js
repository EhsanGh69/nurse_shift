const mongoose = require("mongoose");

const blockUserSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true });

const blockUserModel = mongoose.model('BlockUser', blockUserSchema);

module.exports = blockUserModel;