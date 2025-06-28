const Validator = require('fastest-validator');

const v = new Validator();

const schema = {
    identifier: {
        type: "string",
        min: 3,
        max: 254
    },
    password: {
        type: "string",
        min: 8
    },
    $$strict: true
}

const check = v.compile(schema)

module.exports = check;
