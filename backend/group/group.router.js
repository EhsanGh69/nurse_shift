const { Router } = require('express');

const groupController = require('./group.controller');
const verifyToken = require('../middlewares/verifyToken');
const permission = require('../middlewares/permission');
const validate = require('../middlewares/joiValidator');
const { 
    inviteCodeSchema, createGroupSchema, createSubGroupSchema, addSubGroupMemberSchema,
    removeSubGroupMemberSchema, removeSubGroupSchema
} = require('../validators/groupValidators');

const router = Router()

router.post('/invite',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(inviteCodeSchema),
    groupController.generateInviteCode
)
router.get('/',
    verifyToken,
    groupController.getGroups
)
router.get('/:id',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
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
router.post('/subs',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(createSubGroupSchema),
    groupController.setSubGroup
)
router.post('/subs/shifts',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(removeSubGroupSchema),
    groupController.getSubGroupShiftCount
)
router.put('/subs/remove',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(removeSubGroupSchema),
    groupController.removeSubGroup
)
router.put('/subs/update',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(createSubGroupSchema),
    groupController.updateSubGroup
)
router.put('/subs/member/add',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(addSubGroupMemberSchema),
    groupController.addSubGroupMember
)
router.put('/subs/member/remove',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    validate(removeSubGroupMemberSchema),
    groupController.removeSubGroupMember
)
router.get('/subs/:groupId',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    groupController.getSubGroups
)
router.get('/subs/unassigned/:groupId',
    verifyToken,
    permission(['ADMIN', 'MATRON']),
    groupController.unassignedSubgroupMembers
)

module.exports = router;