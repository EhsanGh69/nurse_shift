const { Router } = require("express");

const shiftController = require("./shift.controller");
const verifyToken = require("../middlewares/verifyToken");
const validate = require("../middlewares/joiValidator");
const permission = require("../middlewares/permission");
const { 
    createShiftSchema, updateShiftSchema, shiftSettingSchema, rejectShiftDaySchema, jobInfoSchema,
    refreshShiftsTableSchema, saveShiftSchema
} = require("../validators/shift.validators");

const router = Router()

//* Shift
router.post('/save',
    verifyToken,
    validate(saveShiftSchema),
    shiftController.saveShift
)
router.post('/create',
    verifyToken,
    validate(createShiftSchema),
    shiftController.createShift
)
router.put('/update/:id',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(updateShiftSchema),
    shiftController.updateShift
)
router.get('/report/:groupId/:year/:month',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    shiftController.getShiftReport
)
router.get('/day_limit/:groupId',
    verifyToken,
    shiftController.getDayLimit
)
router.get('/user/:id',
    verifyToken,
    shiftController.getUserShift
)
router.get('/user/desc/:id',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    shiftController.getUserShiftDescription
)
router.get('/user/all/:groupId',
    verifyToken,
    shiftController.getUserShifts
)
router.put('/expire/:id',
    verifyToken,
    shiftController.checkShiftExpiration
)
router.put('/reject/:id',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(rejectShiftDaySchema),
    shiftController.rejectShiftDay
)
router.get('/reject/:groupId/:id',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    shiftController.getRejectedShiftDays
)

//* Table
// router.post('/tables/refresh',
//     verifyToken,
//     permission(['ADMIN', 'MATRON']),
//     validate(refreshShiftsTableSchema),
//     shiftController.refreshShiftsTables
// )
// router.get('/tables/all/:groupId',
//     verifyToken,
//     permission(['ADMIN', 'MATRON']),
//     shiftController.getAllShiftsTables
// )
// router.get('/tables/:id',
//     verifyToken,
//     permission(['ADMIN', 'MATRON']),
//     shiftController.getShiftsTable
// )

//* Settings
router.post('/settings',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(shiftSettingSchema),
    shiftController.setShiftSettings
)
router.get('/settings/:groupId',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(shiftSettingSchema),
    shiftController.getShiftSettings
)

//* Infos
router.post('/infos',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(jobInfoSchema),
    shiftController.setJobInfo
)
router.get('/infos/:groupId',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    shiftController.getJobInfos
)

module.exports = router;