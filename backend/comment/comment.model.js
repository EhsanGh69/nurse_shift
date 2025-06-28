const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    content: {
        type: [String],
        maxLength: 2,
        default: []
    },
    isAccept: {
        type: Boolean,
        default: false
    },
    isAnswer: {
        type: Boolean,
        required: true
    },
    mainComment: {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
        default: null
    }
}, { timestamps: true })

const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;