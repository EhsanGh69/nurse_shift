const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next();
        } catch (err) {
            if(err.isJoi) {
                const errObject = {};
                err.details.forEach((error) => {
                    errObject[error.context.key] = error.message.replace(/"/g, "");
                })
                return res.status(422).json(errObject);
            }else {
                return res.status(500).json({ error: err.message })
            }
        }
    }
}

module.exports = validate;