const { Router } = require("express");

const categoryController = require("./category.controller");
const verifyToken = require("../middlewares/verifyToken");
const permission = require("../middlewares/permission");

const router = Router()

router.post("/add_category", verifyToken, permission(['ADMIN']), categoryController.addCategory)
router.get("/categories", verifyToken, permission(['ADMIN']), categoryController.allCategories)
router.put("/edit_category/:id", verifyToken, permission(['ADMIN']), categoryController.editCategory)
router.delete("/remove_category/:id", verifyToken, permission(['ADMIN']), categoryController.removeCategory)

module.exports = router;