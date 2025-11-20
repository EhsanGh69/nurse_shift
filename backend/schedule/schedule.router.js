const { Router } = require("express")

const scheduleController = require("./schedule.controller")
const verifyToken = require("../middlewares/verifyToken");
const permission = require("../middlewares/permission");
const validate = require("../middlewares/joiValidator");
const { updateShiftScheduleSchema, refreshShiftsTableSchema } = require("../validators/scheduleValidators")

const router = Router()

router.get('/:groupId/:day',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    scheduleController.getShiftSchedule
)
router.post('/create',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    scheduleController.createShiftsSchedule
)
router.put('/update',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(updateShiftScheduleSchema),
    scheduleController.updateShiftsSchedule
)

//* Table
router.post('/tables/refresh',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(refreshShiftsTableSchema),
    scheduleController.refreshShiftsTables
)
router.get('/tables/all/:groupId',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    scheduleController.getAllShiftsTables
)
router.get('/tables/:id',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    scheduleController.getShiftsTable
)

module.exports = router