const crypto = require("crypto");
const mongoose = require("mongoose");
const slugify = require("slugify");

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 250
    },
    slug: {
        type: String,
        default: null
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },
    status: {
        type: String,
        enum: ["CHECK", "CONFIRM", "REJECT"],
        default: "CHECK"
    },
    isDraft: {
        type: Boolean,
        default: true
    },
    tags: {
        type: Array,
        default: []
    },
    studyTime: {
        type: Number,
        default: 0,
        min: 0
    },
    likeCount: {
        type: Number,
        default: 0,
        min: 0
    },
    confirmDate: {
        type: Date,
        default: null
    }
}, { timestamps: true })

postSchema.pre('save', async function (next) {
    if (!this.slug) {
        const randomStr = crypto.randomBytes(5).toString('hex');
        this.slug = `${randomStr}-${slugify(this.title, { lower: true, strict: true })}`
    }
    next();
})

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;