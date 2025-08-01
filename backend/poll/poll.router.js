const { Router } = require("express");

const pollController = require("./poll.controller");
const verifyToken = require("../middlewares/verifyToken");
const permission = require("../middlewares/permission");
const validate = require('../middlewares/joiValidator');
const { createPollSchema } = require("../validators/pollValidators");

const router = Router()

router.post("/send", 
    verifyToken,
    validate(createPollSchema),
    pollController.sendPoll
)

router.get("/",
    verifyToken,
    permission(['ADMIN']),
    pollController.getUserPolls
)

router.delete("/:pollId/:opinionId",
    verifyToken,
    permission(['ADMIN']),
    pollController.removeUserPoll
)

module.exports = router;