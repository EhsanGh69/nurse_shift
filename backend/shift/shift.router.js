const { Router } = require("express");

const shiftController = require("./shift.controller");
const verifyToken = require("../middlewares/verifyToken");
const validate = require("../middlewares/joiValidator");
const permission = require("../middlewares/permission");
const { 
    createShiftSchema, updateShiftSchema, shiftSettingSchema, rejectShiftDaySchema, jobInfoSchema, saveShiftSchema
} = require("../validators/shiftValidators");

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
router.get('/requests/:groupId/:year/:month',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    shiftController.getRequestedShifts
)
router.put('/temporal',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    shiftController.changeShiftsTemporal
)
router.get('/day_limit/:groupId',
    verifyToken,
    shiftController.getDayLimit
)
router.get('/user/:id',
    verifyToken,
    shiftController.getUserShift
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