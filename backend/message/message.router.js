const { Router } = require('express');

const messageController = require('./message.controller');
const verifyToken = require('../middlewares/verifyToken');
const validator = require('../middlewares/joiValidator');
const { newMessageSchema } = require('../validators/messageValidators');

const router = Router()

router.post('/new', 
    verifyToken,
    validator(newMessageSchema),
    messageController.newMessage
)

router.post('/response/:id', 
    verifyToken,
    validator(newMessageSchema),
    messageController.responseMessage
)

router.get('/', 
    verifyToken,
    validator(newMessageSchema),
    messageController.userMessages
)

module.exports = router;