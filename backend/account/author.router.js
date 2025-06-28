const { Router } = require("express");

const authorController = require("./author.controller");
const verifyToken = require("../middlewares/verifyToken");
const permission = require("../middlewares/permission");
const checkBlock = require("../middlewares/checkBlock");
const { postImageUploader } = require("../utils/uploader");
const { removePrevPostImage } = require("../middlewares/removePrevUpload");

const router = Router()

router.post("/create_post", 
    verifyToken, 
    checkBlock,
    permission(['ADMIN', 'MANAGER', 'AUTHOR']), 
    authorController.createPost
)

router.put("/post_image/:slug",
    verifyToken, 
    checkBlock,
    permission(['ADMIN', 'MANAGER', 'AUTHOR']),
    removePrevPostImage, 
    postImageUploader.fields([
        { name: "cover", maxCount: 1 },
        { name: "content", maxCount: 2 }
    ]), 
    authorController.changePostImage
)

router.put("/check_request/:slug",
    verifyToken, 
    checkBlock,
    permission(['ADMIN', 'MANAGER', 'AUTHOR']),
    authorController.checkRequest
)

router.delete("/remove_post/:slug",
    verifyToken, 
    checkBlock,
    permission(['ADMIN', 'MANAGER', 'AUTHOR']),
    authorController.removePost
)

module.exports = router;