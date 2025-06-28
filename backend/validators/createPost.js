const Validator = require("fastest-validator");

const v = new Validator()

const createPostSchema = {
    title: {
        type: 'string',
        min: 5,
        max: 250,
        //? Valid: En | Fa --> numbers & letters , Invalid: Special Characters (!@#$%^&*)
        pattern: /^[a-zA-Z0-9\u06F0-\u06F9\u0600-\u06FF\s]+$/
    },
    content: {
        type: 'string'
    },
    $$strict: true
}


module.exports = v.compile(createPostSchema);