const crypto = require("crypto");
const { isValidObjectId } = require("mongoose");

const inviteCodeModel = require('./inviteCode.model');
const groupModel = require('./group.model');
const userModel = require('../user/user.model');

exports.getGroups = async (req, res) => {
    const user = req.user;
    const groups = await groupModel.find({ matron: user._id })
    .select("-matron -createdAt -updatedAt").lean()
    res.json(groups)
}

exports.generateInviteCode = async (req, res) => {
    const { firstName, lastName, mobile, groupId } = req.body;
    const user = req.user;

    const group = await groupModel.findOne({ _id: groupId, matron: user._id })
    if(!group)
        return res.status(404).json({ error: "Group not found!" })

    const inviteCodeExist = await inviteCodeModel.findOne({ mobile, group: group._id })
    if(inviteCodeExist)
        return res.status(409).json({ message: "برای شماره وارد شده قبلا کد دعوت ارسال شده است" })

    const userExist = await userModel.findOne({ mobile })
    if(userExist) 
        return res.status(409).json({ message: "کاربری با موبایل وارد شده از قبل وجود دارد" })

    const code = crypto.randomInt(100000, 999999).toString()

    await inviteCodeModel.create({ group: group._id, firstName, lastName, mobile, code })

    res.json({ message: "Invite code generated successfully" })
}

exports.createGroup = async (req, res) => {
    const { province, county, hospital, department } = req.body;
    const user = req.user;

    const group = await groupModel.findOne({ matron: user._id, province, county, hospital })
    if(group)
        return res.status(409).json({ message: "گروهی با مشخصات وارد شده از قبل وجود دارد" })

    await groupModel.create({ matron: user._id, province, county, hospital, department })
    res.status(201).json({ message: "New group created successfully" })
}

exports.groupDetails = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    if(!isValidObjectId(id))
        return res.status(422).json({ error: "Group id is not valid" });

    const group = await groupModel.findOne({ _id: id, matron: user._id })
    .populate("members", "firstName lastName mobile avatar").lean();
    if(!group)
        return res.status(404).json({ message: "Group not found!" });

    res.json(group);
}

exports.getGroupInvitees = async (req, res) => {
    const { id } = req.params;

    if(!isValidObjectId(id))
        return res.status(422).json({ error: "Group id is not valid" });

    const invitees = await inviteCodeModel.find({ group: id })
    .populate("firstName lastName mobile").lean()

    res.json(invitees);
}