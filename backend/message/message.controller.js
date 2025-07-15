const { isValidObjectId } = require('mongoose');
const moment = require('jalali-moment');

const messageModel = require('./message.model');
const userModel = require('../user/user.model');
const groupModel = require('../group/group.model');

exports.newMessage = async (req, res) => {
    const { mobile, content } = req.body;

    const sender = req.user;

    const receiver = await userModel.findOne({ mobile })

    const group = await groupModel.findOne({
        $or: [
            { members: { $all: [sender._id, receiver._id] } },
            { matron: receiver._id }
        ]
    })
    if (!receiver || !group)
        return res.status(404).json({ message: "کاربری با شماره موبایل وارد شده در گروه شما وجود ندارد" })

    await messageModel.create({ from: sender._id, to: receiver._id, content })
    res.status(201).json({ message: "Your message sended successfully" })
}

exports.responseMessage = async () => {
    const user = req.user;
    const { id } = req.params;
    if (!isValidObjectId)
        return res.status(422).json({ error: "User id is not valid" })

    const contact = userModel.findById(id)
    const group = await groupModel.findOne({
        members: { $all: [user._id, contact._id] }
    })
    if (!contact || !group)
        return res.status(404).json({ error: "User not found" })

    const { content } = req.body;

    await messageModel.create({ from: user._id, to: contact._id, content })
    res.status(201).json({ message: "Your message sended successfully" })
}

exports.userMessages = async (req, res) => {
    const user = req.user;

    const messages = await messageModel.find({
        $or: [{ from: user._id }, { to: user._id }]
    }).lean()

    const group = await groupModel.findOne({ members: { $all: [user._id] } })
        .select("members matron")
        .populate("members", "firstName lastName mobile")
        .populate("matron", "firstName lastName mobile").lean()
    if (!group) return res.status(404).json({ error: "Group not found" })

    const groupMembers = [...group.members, group.matron]
    const memberIds = groupMembers
    .filter(member => member._id.toString() !== user._id.toString())
    .map(member => member._id.toString())

    const conversationMap = {}
    messages.map(message => {
        const contactId = message.from.equals(user._id) ? message.to.toString() : message.from.toString()
        const fromSelf = message.from.equals(user._id)

        if (memberIds.includes(contactId)) {
            if (!conversationMap[contactId]) {
                conversationMap[contactId] = []
            }

            conversationMap[contactId].push({
                content: message.content,
                createdAt: moment(message.createdAt).locale('fa').format('YYYY/MM/DD HH:mm'), 
                fromSelf
            })
        }
    })

    for (const contactId in conversationMap) {
        conversationMap[contactId].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    }

    const conversations = memberIds.map(memberId => {
        const member = groupMembers.find(m => m._id.toString() === memberId)
        return {
            contact: {
                firstName: member.firstName,
                lastName: member.lastName,
                mobile: member.mobile
            },
            messages: conversationMap[memberId] || []
        }
    })

    res.json(conversations)
}
