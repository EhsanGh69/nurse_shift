const mongoose = require("mongoose");

const inviteCodeSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    code: String
})

const inviteCodeModel = mongoose.model('InviteCode', inviteCodeSchema);

module.exports = inviteCodeModel;