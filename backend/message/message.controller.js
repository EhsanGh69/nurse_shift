const { isValidObjectId } = require('mongoose');
const moment = require('jalali-moment');

const messageModel = require('./message.model');
const userModel = require('../user/user.model');
const groupModel = require('../group/group.model');

exports.newConversation = async (req, res) => {
    const { mobile, content } = req.body;

    const sender = req.user;

    const receiver = await userModel.findOne({ mobile })

    const group = await groupModel.findOne({
        $or: [
            { members: { $all: [receiver._id] } },
            { matron: receiver._id }
        ]
    })
    if (!receiver || !group)
        return res.status(404).json({ message: "کاربری با شماره موبایل وارد شده در گروه شما وجود ندارد" })

    await messageModel.create({ from: sender._id, to: receiver._id, content })
    res.status(201).json({ message: "Your message sended successfully" })
}

exports.responseMessage = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    if (!isValidObjectId)
        return res.status(422).json({ error: "User id is not valid" })

    const contact = await userModel.findById(id)
    const group = await groupModel.findOne({
        $or: [{ members: { $all: [contact._id] } }, { matron: contact._id }]
    })
    if (!contact || !group)
        return res.status(404).json({ error: "User not found" })
    
    const { content } = req.body;

    await messageModel.create({ from: user._id, to: contact._id, content })
    res.status(201).json({ message: "Your message sended successfully" })
}

exports.userConversations = async (req, res) => {
    const user = req.user;

    const messages = await messageModel.find({
        $or: [{ from: user._id }, { to: user._id }]
    }).lean()

    if(!messages.length) return res.json(messages)

    const groups = await groupModel.find({ 
        $or: [{ members: { $all: [user._id] } }, { matron: user._id }]
     })
        .select("members matron")
        .populate("members", "firstName lastName mobile")
        .populate("matron", "firstName lastName mobile").lean()
    if (!groups.length) return res.status(404).json({ error: "Group not found" })

    const allContacts = []
    groups.map(group => {
        const groupContact = [...group.members, group.matron]
        .filter(member => member._id.toString() !== user._id.toString())
        allContacts.push(...groupContact)
    })
    const contactIds = allContacts.map(member => member._id.toString())

    const conversationMap = {}
    messages.map(message => {
        const contactId = message.from.equals(user._id) ? message.to.toString() : message.from.toString()
        const fromSelf = message.from.equals(user._id)

        if (contactIds.includes(contactId)) {
            if (!conversationMap[contactId]) {
                conversationMap[contactId] = []
            }

            conversationMap[contactId].push({
                id: message._id,
                content: message.content,
                createdAt: moment(message.createdAt).locale('fa').format('jYYYY/jMM/jDD - HH:mm'), 
                fromSelf,
                seen: message.seen
            })
        }
    })

    for (const contactId in conversationMap) {
        conversationMap[contactId].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    }

    const conversations = contactIds.map(contactId => {
        const userContact = allContacts.find(m => m._id.toString() === contactId)
        return {
            contact: {
                id: userContact._id,
                firstName: userContact.firstName,
                lastName: userContact.lastName,
                mobile: userContact.mobile
            },
            messages: conversationMap[contactId] || []
        }
    })

    res.json(conversations)
}

exports.seenMessages = async (req, res) => {
    const { ids } = req.body;
    const user = req.user;

    await messageModel.updateMany(
        { _id: { $in: ids },  to: user.id },
        { $set: { seen: true } }
    )

    res.json({ message: "Your messages seen successfully" })
}

exports.getUserContacts = async (req, res) => {
    const user = req.user;

    const groups = await groupModel.find({ 
        $or: [{ members: { $all: [user._id] } }, { matron: user._id }]
     })
        .select("members matron")
        .populate("members", "firstName lastName mobile avatar")
        .populate("matron", "firstName lastName mobile avatar").lean()
    if (!groups.length) return res.status(404).json({ error: "Group not found" })

    const allContacts = []
    groups.map(group => {
        const groupContact = [...group.members, group.matron]
        .filter(member => member._id.toString() !== user._id.toString())
        allContacts.push(...groupContact)
    })

    res.json(allContacts)
}
