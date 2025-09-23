const crypto = require("crypto");
const { isValidObjectId, Types: mongooseTypes } = require("mongoose");

const inviteCodeModel = require('./inviteCode.model');
const groupModel = require('./group.model');
const userModel = require('../user/user.model');
const subGroupModel = require('./subGroup.model');
const jobInfoModel = require('../shift/jobInfo.model');

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
    await subGroupModel.create({ group: newGroup._id })

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

    res.json(invitees);
}

exports.setSubGroup = async (req, res) => {
    const { groupId, order, shiftCount } = req.body;
    const user = req.user;
    
    const group = await groupModel.findOne({ _id: groupId, matron: user._id })
    if(!group) return res.status(404).json({ error: "Group not found!" })
        
    const subGroups = await subGroupModel.findOneAndUpdate({ group: groupId }, {
        $push: { subs: { order, shiftCount } }
    })
    if(!subGroups) return res.status(404).json({ error: "Sub Group not found!" })
            
    // const { groupId } = req.body;
    // await subGroupModel.create({ group: groupId })
    res.json({ message: "Sub group created successfully" })
}

exports.addSubGroupMember = async (req, res) => {
    const user = req.user;
    const { groupId, order, memberId, rank } = req.body

    const group = await groupModel.findOne({ _id: groupId, matron: user._id })
    if(!group) return res.status(404).json({ error: "Group not found!" })
    
    const subGroups = await subGroupModel.findOne({ group: groupId })
    if(!subGroups) return res.status(404).json({ error: "Subgroup not found!" })

    const subGroup = subGroups.subs.find(sub => sub.order === order)
    if(!subGroup) return res.status(404).json({ error: "Subgroup order not found!" })

    const memberExists = subGroup.members.some(m => String(m.user) === memberId)
    if(memberExists) return res.status(409).json({ error: "This user already exists in this subgroup" })

    const memberObjectId = new mongooseTypes.ObjectId(String(memberId))
    subGroup.members.push({ user: memberObjectId, rank })

    await subGroups.save()
    return res.json({ message: "Subgroup member added successfully" })
}

exports.getSubGroups = async (req, res) => {
    const user = req.user;
    const { groupId } = req.params;

    if(!isValidObjectId(groupId)) return res.status(422).json({ error: "Group id is not valid" });
    const group = await groupModel.findOne({ _id: groupId, matron: user._id })
    if(!group) return res.status(404).json({ error: "Group not found!" })

    const subGroups = await subGroupModel.findOne({ group: groupId })
    .populate({ path: "subs.members.user", select: "firstName lastName", model: "User" })
    .lean()
    if(!subGroups) return res.status(404).json({ error: "Subgroup not found!" })

    res.json(subGroups);
}           

exports.unassignedSubgroupMembers = async (req, res) => {
    const user = req.user;
    const { groupId } = req.params;

    if(!isValidObjectId(groupId)) return res.status(422).json({ error: "Group id is not valid" });
    const group = await groupModel.findOne({ _id: groupId, matron: user._id }).populate('members')
    if(!group) return res.status(404).json({ error: "Group not found!" })

    const subGroup = await subGroupModel.findOne({ group: groupId })
    if(!subGroup) return res.status(404).json({ error: "Subgroup not found!" })

    const assignedUserIds = new Set()

    for(const sub of subGroup.subs){
        for(const member of sub.members){
            assignedUserIds.add(member.user.toString())
        }
    }

    const unassigned = group.members.filter(member => !assignedUserIds.has(member._id.toString()))

    const jobInfos = await jobInfoModel.find({ group: groupId }).populate('user', 'firstName lastName')
    if(!jobInfos) return res.status(404).json({ message: "اطلاعات پرستاران وارد نشده است" })

    const unassignedMembers = []

    unassigned.forEach(unMember => {
        jobInfos.forEach(jInfo => {
            if(unMember._id.toString() === jInfo.user._id.toString()){
                unassignedMembers.push({
                    fullName: `${jInfo.user.firstName} ${jInfo.user.lastName}`,
                    employment: jInfo.employment,
                    experience: jInfo.experience
                })
            }
        })
    })

    res.json(unassignedMembers)
}

