const { Router } = require("express")

const scheduleController = require("./schedule.controller")
const verifyToken = require("../middlewares/verifyToken");
const permission = require("../middlewares/permission");

const router = Router()

router.post('/create',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    scheduleController.createShiftsSchedule
)

module.exports = router