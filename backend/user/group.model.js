const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    matron: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    province: {
        type: String,
        required: false
    },
    county: {
        type: String,
        required: false
    },
    hospital: {
        type: String,
        required: false
    },
    department: {
        type: String,
        required: false
    }
}, { timestamps: true })

const groupModel = mongoose.model('Group', groupSchema);

module.exports = groupModel;