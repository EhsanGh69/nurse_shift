const { Router } = require('express');

const accountController = require('./account.controller');
const verifyToken = require('../middlewares/verifyToken');
const checkBlock = require('../middlewares/checkBlock');
const validate = require('../middlewares/joiValidator');
const { changePasswordSchema, editAccountSchema } = require('../validators/accountValidators');
const { avatarUploader } = require("../utils/uploader");
const { removePrevAvatar } = require("../middlewares/removePrevUpload");

const router = Router()

router.post('/change_password', 
    verifyToken,
    checkBlock,
    validate(changePasswordSchema),
    accountController.changePassword
)
router.put('/edit', 
    verifyToken,
    checkBlock,
    validate(editAccountSchema),
    avatarUploader.single('avatar'),
    removePrevAvatar,
    accountController.editAccount
)

module.exports = router;