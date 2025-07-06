const { Router } = require('express');

const matronController = require('./matron.controller');
const verifyToken = require('../middlewares/verifyToken');
const permission = require('../middlewares/permission');
const validate = require('../middlewares/joiValidator');
const { inviteCodeSchema, createGroupSchema } = require('../validators/matronValidators');

const router = Router()

router.post('/groups/invite',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(inviteCodeSchema),
    matronController.generateInviteCode
)
router.get('/groups',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    matronController.getGroups
)
router.get('/groups/:id',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    matronController.groupDetails
)
router.post('/groups/create',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(createGroupSchema),
    matronController.createGroup
)

module.exports = router;