const { Router } = require('express');

const accountController = require('./account.controller');
const verifyToken = require('../middlewares/verifyToken');
const checkBlock = require('../middlewares/checkBlock');
const validate = require('../middlewares/joiValidator');
const { changePasswordSchema } = require('../validators/accountValidators');

const router = Router()

router.post('/change_password', 
    verifyToken,
    checkBlock,
    validate(changePasswordSchema),
    accountController.changePassword
)

module.exports = router;