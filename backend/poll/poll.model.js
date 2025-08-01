const mongoose = require("mongoose");

const opinionSchema = new mongoose.Schema({
    id: {
        type: Number,
        default: 1
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {_id: false})

const pollSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    opinions: {
        type: [opinionSchema],
        default: []
    }
})

module.exports = mongoose.model('Poll', pollSchema)