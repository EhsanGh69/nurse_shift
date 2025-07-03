const { Router } = require('express');

const matronController = require('./matron.controller');
const verifyToken = require('../middlewares/verifyToken');
const permission = require('../middlewares/permission');
const validate = require('../middlewares/joiValidator');
const { inviteCodeSchema, createGroupSchema } = require('../validators/matronValidators');

const router = Router()

router.post('/invite_code',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(inviteCodeSchema),
    matronController.generateInviteCode
)
router.post('/create_group',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(createGroupSchema),
    matronController.createGroup
)

module.exports = router;