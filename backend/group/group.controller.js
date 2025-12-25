const crypto = require("crypto");
const { isValidObjectId, Types: mongooseTypes } = require("mongoose");

const inviteCodeModel = require('./inviteCode.model');
const groupModel = require('./group.model');
const userModel = require('../user/user.model');
const maxShiftsModel = require('./maxShifts.model');
const shiftScheduleModel = require("../schedule/shiftSchedule.model");


exports.getGroups = async (req, res) => {
    const user = req.user;
    const groups = await groupModel.find({ $or: [{ members: { $all: [user._id] } }, { matron: user._id }] })
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
    if(group) return res.status(409).json({ message: "گروهی با مشخصات وارد شده از قبل وجود دارد" })

    const newGroup = await groupModel.create({ matron: user._id, province, county, hospital, department })
    await maxShiftsModel.create({ group: newGroup._id })
    await shiftScheduleModel.create({ group: group._id })

    res.status(201).json({ message: "New group created successfully" })
}

exports.groupDetails = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    if(!isValidObjectId(id))
        return res.status(422).json({ error: "Group id is not valid" });

    const group = await groupModel.findOne({ 
        _id: id, $or: [{ members: { $all: [user._id] } }, { matron: user._id }] 
    })
    .populate("matron", "firstName lastName mobile avatar")
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

    const inviteCodes = await inviteCodeModel.find({ group: id }).select("mobile code").lean()

    res.json({ invitees, inviteCodes });
}

exports.setMaxShifts = async (req, res) => {
    const { groupId, memberId, isMutable, maxCounts } = req.body;
    const user = req.user;
    
    const group = await groupModel.findOne({ 
        _id: groupId, $and: [{ members: { $all: [memberId] } }, { matron: user._id }] 
    })
    if(!group) return res.status(404).json({ error: "Group not found!" })
    
    const maxShifts = await maxShiftsModel.findOne({ group: groupId })
    if(!maxShifts) return res.status(404).json({ error: "Max Shifts not found!" })

    const zeroVals = Object.values(maxCounts).every(val => val === 0)
    if(isMutable && zeroVals)
        return res.status(400).json({ message: "در برنامه متغیر همه مقادیر حداکثر مجاز نمی تواند صفر باشد" })
    else if(!isMutable && !zeroVals)
        return res.status(400).json({ message: "در برنامه ثابت همه مقادیر حداکثر مجاز باید صفر باشند" })

    const foundMember = maxShifts.members.find(member => String(member.user) === memberId)
    if(foundMember){
        foundMember.isMutable = isMutable
        foundMember.maxCounts = maxCounts
        await maxShifts.save()
    }else {
        const memberObjectId = new mongooseTypes.ObjectId(String(memberId))
        maxShifts.members.push({ user: memberObjectId, isMutable, maxCounts })
        await maxShifts.save()
    }

    res.json({ message: "Max Shifts set successfully" })
}

exports.getMaxShifts = async (req, res) => {
    const user = req.user;
    const { groupId } = req.params;

    if(!isValidObjectId(groupId)) return res.status(422).json({ error: "Group id is not valid" });
    const group = await groupModel.findOne({ _id: groupId, matron: user._id })
    if(!group) return res.status(404).json({ error: "Group not found!" })

    const maxShifts = await maxShiftsModel.findOne({ group: groupId }).lean()
    if(!maxShifts) return res.status(404).json({ error: "Subgroup not found!" })

    res.json(maxShifts)
}           
