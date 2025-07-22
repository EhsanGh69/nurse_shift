const { Router } = require('express');

const groupController = require('./group.controller');
const verifyToken = require('../middlewares/verifyToken');
const permission = require('../middlewares/permission');
const validate = require('../middlewares/joiValidator');
const { inviteCodeSchema, createGroupSchema } = require('../validators/groupValidators');

const router = Router()

router.post('/invite',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(inviteCodeSchema),
    groupController.generateInviteCode
)
router.get('/',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    groupController.getGroups
)
router.get('/:id',
    verifyToken,
    groupController.groupDetails
)
router.get('/invitees/:id',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    groupController.getGroupInvitees
)
router.post('/create',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(createGroupSchema),
    groupController.createGroup
)

module.exports = router;