const mongoose = require("mongoose");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: 150
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: 254
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: false,
        default: '',
        maxLength: 150
    },
    lastName: {
        type: String,
        required: false,
        default: '',
        maxLength: 150
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isStaff: {
        type: Boolean,
        default: false
    },
    isSuperuser: {
        type: Boolean,
        default: false
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
        enum: ["ADMIN", "MANAGER", "AUTHOR", "USER"],
        default: "USER"
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
