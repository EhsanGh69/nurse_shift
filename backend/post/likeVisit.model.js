const mongoose = require("mongoose");

const userLikeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    posts: {  // many-to-many relation
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Post',
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: false })


const postVisitSchema = new mongoose.Schema({
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Post',
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: false })

const userLikeModel = mongoose.model("UserLike", userLikeSchema);
const postVisitModel = mongoose.model("PostVisit", postVisitSchema);


module.exports = {
    userLikeModel,
    postVisitModel
};