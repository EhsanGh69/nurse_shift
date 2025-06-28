const Validator = require('fastest-validator');

const v = new Validator();

const schema = {
    username: {
        type: "string",
        min: 3,
        max: 150,
        pattern: /^[a-zA-Z0-9]{3,150}$/,
        messages: {
            pattern: 'نام کاربری باید فقط شامل حروف و اعداد باشد و حداقل 3 کاراکتر داشته باشد.'
        }
    },
    email: {
        type: "email",
        max: 254
    },
    password: {
        type: "string",
        min: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,128}$/,
        messages: {
            pattern: 'رمز عبور باید شامل حروف کوچک، حروف بزرگ و عدد باشد و حداقل 8 کاراکتر داشته باشد.'
        }
    },
    confirmPassword: {
        type: "equal",
        field: "password"
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
