const { Router } = require("express");

const postController = require("./post.controller");
const verifyToken = require("../middlewares/verifyToken");
const permission = require("../middlewares/permission");
const checkBlock = require("../middlewares/checkBlock");

const router = Router()

router.get('/check', 
    verifyToken, 
    checkBlock,
    permission(['ADMIN', 'MANAGER']), 
    postController.postsList
)
router.get('/confirm', 
    verifyToken,
    checkBlock, 
    permission(['ADMIN', 'MANAGER']), 
    postController.postsList
)
router.get('/reject', 
    verifyToken, 
    checkBlock,
    permission(['ADMIN', 'MANAGER']), 
    postController.postsList
)
router.put('/confirm_post/:slug', 
    verifyToken,
    checkBlock, 
    permission(['ADMIN', 'MANAGER']), 
    postController.confirmPost
)

module.exports = router;