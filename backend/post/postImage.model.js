const mongoose = require("mongoose");

const postImageSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    content: {
        type: [String],
        maxLength: 2,
        default: []
    }
}, { timestamps: true })

const postImageModel = mongoose.model("PostImage", postImageSchema);

module.exports = postImageModel;