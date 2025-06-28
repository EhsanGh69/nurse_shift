const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 100
    },
    href: {
        type: String,
        required: true,
        maxLength: 100
    },
    isSubCategory: {
        type: Boolean,
        default: false
    },
    mainCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    }
})

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;