const Validator = require("fastest-validator");

const v = new Validator();

const changePasswordSchema = {
    oldPassword: {
        type: "string"
    },
    newPassword: {
        type: "string",
        min: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,128}$/,
        messages: {
            pattern: 'رمز عبور باید شامل حروف کوچک، حروف بزرگ و عدد باشد و حداقل 8 کاراکتر داشته باشد.'
        }
    },
    confirmNewPassword: {
        type: "equal",
        field: "newPassword"
    },
    $$strict: true
}

const resetPasswordSchema = {
    newPassword: {
        type: "string",
        min: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,128}$/,
        messages: {
            pattern: 'رمز عبور باید شامل حروف کوچک، حروف بزرگ و عدد باشد و حداقل 8 کاراکتر داشته باشد.'
        }
    },
    confirmNewPassword: {
        type: "equal",
        field: "newPassword"
    },
    $$strict: true
}

const changePasswordCheck = v.compile(changePasswordSchema)
const resetPasswordCheck = v.compile(resetPasswordSchema)

module.exports = {
    changePasswordValidator: changePasswordCheck,
    resetPasswordValidator: resetPasswordCheck
};