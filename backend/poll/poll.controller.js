const pollModel = require("./poll.model");
const moment = require('jalali-moment');


exports.sendPoll = async (req, res) => {
    const userId = req.user._id;
    const { opinion } = req.body;

    const userPoll = await pollModel.findOneAndUpdate({ user: userId })

    if(userPoll){
        const newOpinionId = userPoll.opinions[userPoll.opinions.length - 1].id + 1
        userPoll.opinions.push({
            id: newOpinionId,
            content: opinion, 
            createdAt: new Date()
        })
        await userPoll.save()
        return res.json({ message: "Your poll sended successfully" })
    }
    else {
        await pollModel.create({ 
            user: userId, 
            opinions: [{
                content: opinion,
                createdAt: new Date()
            }] 
        })
        return res.status(201).json({ message: "Your poll sended successfully" })
    }
}

exports.getUserPolls = async (req, res) => {
    const allPolls = await pollModel.find({})
    .populate("user", "firstName lastName mobile").lean()

    const formattedPolls = allPolls.map(poll => ({
        id: poll._id,
        fullName: `${poll.user.firstName} ${poll.user.lastName}`,
        mobile: poll.user.mobile,
        opinions: [
            ...poll.opinions.map(opinion => ({
                ...opinion,
                createdAt: moment(poll.opinions.createdAt).locale('fa').format('jYYYY/jMM/jDD - HH:mm')
            }))
        ]
    }))
    
    res.json(formattedPolls)
}

exports.removeUserPoll = async (req, res) => {
    const { pollId, opinionId } = req.params;

    const userPoll = await pollModel.findByIdAndUpdate(pollId, 
        { $pull: { opinions: { id: opinionId } } },
        { new: true }
    )

    if(!userPoll.opinions.length)
        await userPoll.deleteOne()
    
    res.json({ message: "User poll removed successfully" })
}
