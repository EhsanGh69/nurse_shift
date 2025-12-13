const { Router } = require("express")

const scheduleController = require("./schedule.controller")
const verifyToken = require("../middlewares/verifyToken");
const permission = require("../middlewares/permission");
const validate = require("../middlewares/joiValidator");
const { updateShiftScheduleSchema, refreshShiftsTableSchema } = require("../validators/scheduleValidators")

const router = Router()

router.get('/get/:groupId/:day',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    scheduleController.getShiftSchedule
) 
router.post('/create/primary',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    scheduleController.createPrimaryShiftsSchedule
)
router.post('/create/final',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    scheduleController.createFinalShiftsSchedule
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
router.get('/tables/:id',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    scheduleController.getShiftsTable
)
router.get('/tables/all/:groupId',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    scheduleController.getAllShiftsTables
)

module.exports = router