const { Router } = require("express");

const shiftController = require("./shift.controller");
const verifyToken = require("../middlewares/verifyToken");
const validate = require("../middlewares/joiValidator");
const permission = require("../middlewares/permission");
const { 
    createShiftSchema, updateShiftSchema, shiftSettingSchema, rejectShiftDaySchema, jobInfoSchema
} = require("../validators/shift.validators");

const router = Router()

router.post('/',
    verifyToken,
    validate(createShiftSchema),
    shiftController.createShift
)
router.put('/:id',
    verifyToken,
    validate(updateShiftSchema),
    shiftController.updateShift
)
router.get('/report/:groupId',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    shiftController.getShiftReport
)
router.get('/user',
    verifyToken,
    shiftController.getUserShifts
)
router.get('/group/:groupId',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    shiftController.getGroupShifts
)
router.put('/reject/:id',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(rejectShiftDaySchema),
    shiftController.rejectShiftDay
)
router.post('/settings',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(shiftSettingSchema),
    shiftController.setShiftSettings
)
router.put('/settings/:id',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(shiftSettingSchema),
    shiftController.updateShiftSettings
)
router.post('/info',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(jobInfoSchema),
    shiftController.setJobInfo
)
router.put('/info/:id',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(jobInfoSchema),
    shiftController.updateJobInfo
)

module.exports = router;