const Validator = require("fastest-validator");

const v = new Validator()

v.alias('objectId', {
    type: 'string',
    pattern: /^[0-9a-fA-F]{24}$/,
    messages: {
        stringPattern: "This field's value must be a valid objectId",
    }
});

const categorySchema = {
    title: {
        type: 'string',
        max: 100
    },
    href: {
        type: 'string',
        max: 100
    },
    isSubCategory: {
        type: 'boolean',
        optional: true
    },
    mainCategory: {
        type: "objectId",
        optional: true
    }
}

module.exports = v.compile(categorySchema);