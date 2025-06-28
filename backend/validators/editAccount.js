const Validator = require("fastest-validator");

const v = new Validator();

const schema = {
    email: {
        type: "email",
        max: 254
    },
    firstName: {
        type: "string",
        max: 150,
        optional: true
    },
    lastName: {
        type: "string",
        max: 150,
        optional: true
    },
    $$strict: true
}

const check = v.compile(schema)

module.exports = check;