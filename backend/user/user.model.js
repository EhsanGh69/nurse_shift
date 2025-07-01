const mongoose = require("mongoose");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    inviteCode: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
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
    province: {
        type: String,
        required: true
    },
    county: {
        type: String,
        required: true
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
    role: {
        type: String,
        enum: ["ADMIN", "MATRON", "NURSE"],
        default: "NURSE"
    },
    avatar: {
        type: String,
        default: function () {
            //`https://s.gravatar.com/avatara/${emailHash}?s={size}&d={default}`
            return gravatar.url(this.email, {
                s: '80', // size
                d: 'identicon', // default: monsterid / identicon
                r: 'g' // rating
            }, true) // using https 
        }
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
