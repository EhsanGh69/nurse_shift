const { Router } = require("express");

const userController = require("./user.controller")
const verifyToken = require("../middlewares/verifyToken")
const permission = require("../middlewares/permission")

const router = Router();

router.get('/', verifyToken, permission(["ADMIN"]), userController.getAll)

router.get('/:id', verifyToken, permission(["ADMIN"]), userController.getOne)

router.post('/block_user/:id', verifyToken, permission(["ADMIN"]), userController.blockUserHandler)

router.delete('/unblock_user/:id', verifyToken, permission(["ADMIN"]), userController.blockUserHandler)

module.exports = router;