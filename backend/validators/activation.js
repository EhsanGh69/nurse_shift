const Validator = require('fastest-validator');

const v = new Validator()

// send activation code
const codeSchema = {
    code: {
        type: 'string',
        length: 6,
        pattern: /^[0-9]{6}$/
    },
    $$strict: true
}

// resend activation code
const emailSchema = {
    email: {
        type: 'email',
        max: 254
    },
    $$strict: true
}

const checkCode = v.compile(codeSchema)
const checkEmail = v.compile(emailSchema)

module.exports = {
    activateValidation: checkCode,
    resendValidation: checkEmail
};
