const { Router } = require("express");

const verifyToken = require("../middlewares/verifyToken");
const checkBlock = require("../middlewares/checkBlock");
const accountController = require("./account.controller");
const { removePrevAvatar } = require("../middlewares/removePrevUpload");
const { avatarUploader } = require("../utils/uploader");

const router = Router()

router.put('/change_password', 
    verifyToken,
    checkBlock, 
    accountController.changePassword
)
router.get('/account_info', 
    verifyToken,
    checkBlock, 
    accountController.accountInfo
)
router.put('/edit_account', 
    verifyToken,
    checkBlock, 
    accountController.editAccount
)
router.put('/change_avatar',
    verifyToken,
    checkBlock, 
    removePrevAvatar,
    avatarUploader.single('avatar'),
    accountController.changeAvatar
)
router.delete('/remove_avatar', 
    verifyToken,
    checkBlock,
    removePrevAvatar, 
    accountController.removeAvatar
)

module.exports = router;