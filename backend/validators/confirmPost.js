const Validator = require("fastest-validator");

const v = new Validator()

v.alias('objectId', {
    type: 'string',
    pattern: /^[0-9a-fA-F]{24}$/,
    messages: {
        stringPattern: "This field's value must be a valid objectId",
    }
});

const confirmPostSchema = {
    category: {
        type: 'objectId'
    },
    studyTime: {
        type: 'number',
        min: 1,
        integer: true
    },
    tags: {
        type: 'array',
        items: {
            type: 'string',
            // valid: En | Fa letters & numbers, underline(_)
            pattern: /^[a-zA-Z0-9\u06F0-\u06F9\u0600-\u06FF_]+$/
        },
        min: 1
    },
    $$strict: true
}

module.exports = v.compile(confirmPostSchema);