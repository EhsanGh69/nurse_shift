const { Router } = require('express');

const messageController = require('./message.controller');
const verifyToken = require('../middlewares/verifyToken');
const validator = require('../middlewares/joiValidator');
const { newMessageSchema, responseMessageSchema, seenMessageSchema } = require('../validators/messageValidators');

const router = Router()

router.post('/new', 
    verifyToken,
    validator(newMessageSchema),
    messageController.newConversation
)

router.post('/response/:id', 
    verifyToken,
    validator(responseMessageSchema),
    messageController.responseMessage
)

router.put('/seen', 
    verifyToken,
    validator(seenMessageSchema),
    messageController.seenMessages
)

router.get('/conversations', 
    verifyToken,
    messageController.userConversations
)

router.get('/contacts', 
    verifyToken,
    messageController.getUserContacts
)

module.exports = router;