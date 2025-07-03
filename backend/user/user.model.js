const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 150,
        minLength: 3
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 150,
        minLength: 3
    },
    mobile: {
        type: String,
        required: true
    },
    nationalCode: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["ADMIN", "MATRON", "NURSE"],
        default: "NURSE"
    },
    avatar: {
        type: String,
        default: ""
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        required: false,
        default: null
    },
    refreshToken: String
}, { timestamps: false });

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
})

userSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model('User', userSchema)

module.exports = userModel;