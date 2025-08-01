const { Router } = require("express");
const settingController = require("./setting.controller");
const verifyToken = require("../middlewares/verifyToken");
const validate = require("../middlewares/joiValidator");
const { changeSettingSchema } = require("../validators/settingValidators");


const router = Router()

router.get("/",
    verifyToken,
    settingController.getSettings
)
router.post("/change",
    verifyToken,
    validate(changeSettingSchema),
    settingController.changeSettings
)
router.put("/theme",
    verifyToken,
    settingController.changeTheme
)

module.exports = router;