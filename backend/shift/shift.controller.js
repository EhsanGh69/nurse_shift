const moment = require('jalali-moment');

const shiftModel = require("./shift.model");
const groupModel = require("../group/group.model");
const shiftSettingModel = require("./shiftSetting.model");
const jobInfoModel = require('./jobInfo.model');
const { getShiftDays } = require("../utils/shiftDays");

const currentYear = moment(new Date()).locale('fa').format('jYYYY')
const currentMonth = moment(new Date()).locale('fa').format('jMM')
const currentDay = moment(new Date()).locale('fa').format('jDD')


const shiftsTable = [
    {
        fullname: "",
        post: 1,
        employment: 1,
        experience: 12,
        hourReduction: 18,
        promotionDuty: 112,
        nonPromotionDuty: 139,
        shiftDays: ["M1", "N4", "E7", "NH6", "EH25", "MH28"],
        nonPromotionOperation : `(allMIncludeCount * NPM) + (allEIncludeCount * NPE) + ...`,
        promotionOperation : `(allMCount * PM) + (allMHCount * PMH) + ...`,
        nonPromotionOvertime: "اضافه کار بدون ارتقا",
        promotionOvertime: "اضافه کار با ارتقا",
    }
]


exports.createShift = async (req, res) => {
    const userId = req.user._id
    const { groupId, shiftDays, description } = req.body

    const userGroup = await groupModel.findOne({
        _id: groupId, $or: [{ members: { $all: [userId] } }, { matron: userId }]
    })
    if (!userGroup)
        return res.status(404).json({ error: "User group not found" })

    const shiftSetting = await shiftSettingModel.findOne({ group: groupId })
    if (!shiftSetting)
        return res.status(400).json({ message: "ارسال شیفت امکان پذیر نمی باشد" })

    if (Number(currentDay) > shiftSetting.dayLimit)
        return res.status(400).json({ message: "مهلت ارسال شیفت به پایان رسیده است" })

    await shiftModel.create({
        user: userId,
        group: groupId,
        shiftDays,
        month: currentMonth === '12' ? '1' : String(Number(currentMonth) + 1),
        year: currentMonth === '12' ? String(Number(currentYear) + 1) : currentYear,
        description
    })
    res.status(201).json({ message: "Shift created successfully" })
}

exports.updateShift = async (req, res) => {
    const user = req.user
    const { id } = req.params
    const { groupId, shiftDays, description } = req.body

    const userGroup = await groupModel.findOne({
        _id: groupId, $or: [{ members: { $all: [user._id] } }, { matron: user._id }]
    })
    if (!userGroup)
        return res.status(404).json({ error: "User group not found" })

    const shiftSetting = await shiftSettingModel.findOne({ group: groupId })
    if (!shiftSetting)
        return res.status(400).json({ message: "ویرایش شیفت امکان پذیر نمی باشد" })

    const shift = await shiftModel.findOne({ _id: id, group: groupId })
    if (!shift)
        return res.status(404).json({ error: "Shift not found" })

    if (Number(currentYear) >= Number(shift.year) || Number(currentMonth) >= Number(shift.month)) {
        shift.expired = true
        await shift.save()
    }

    if (shift.expired || user.role === 'NURSE' && Number(currentDay) > shiftSetting.dayLimit)
        return res.status(400).json({ message: "مهلت ویرایش شیفت به پایان رسیده است" })

    shift.shiftDays = shiftDays
    shift.description = description
    await shift.save()

    res.json({ message: "Shift updated successfully" })
}

exports.getShiftReport = async (req, res) => {
    const userId = req.user._id
    const { groupId } = req.params

    const userGroup = await groupModel.findOne({ _id: groupId, matron: userId })
    if (!userGroup)
        return res.status(404).json({ error: "User group not found" })

    const groupShifts = await shiftModel.find({ group: groupId })
        .populate("user firstName lastName mobile").lean()

    res.json(getShiftDays(groupShifts))
}

exports.getUserShifts = async (req, res) => {
    const userId = req.user._id

    const userShifts = await shiftModel.find({ user: userId })
        .populate("group", "province county hospital department").lean()
    res.json(userShifts)
}

exports.getGroupShifts = async (req, res) => {
    const userId = req.user._id
    const { groupId } = req.params

    const userGroup = await groupModel.findOne({ _id: groupId, matron: userId })
    if (!userGroup)
        return res.status(404).json({ error: "User group not found" })

    const groupShifts = await shiftModel.find({ group: groupId })
        .populate("group", "province county hospital department")
        .populate("user firstName lastName mobile").lean()
    res.json(groupShifts)
}

exports.rejectShiftDay = async (req, res) => {
    const userId = req.user._id
    const { id } = req.params
    const { groupId, shiftDay } = req.body

    const userGroup = await groupModel.findOne({ _id: groupId, matron: userId })
    if (!userGroup)
        return res.status(404).json({ error: "User group not found" })

    const shift = await shiftModel.findOne({ _id: id, group: groupId })
    if (!shift)
        return res.status(404).json({ error: "Shift not found" })

    shift.rejects.push(shiftDay)
    const match = shiftDay.match(/^([A-Z]+)(\d{1,2})$/)
    const [_, key, numStr] = match
    const num = parseInt(numStr, 10)
    if(shift.shiftDays[key]){
        shift.shiftDays[key] = shift.shiftDays[key].filter(day => day !== num)
    }

    await shift.save()

    res.json({ message: "Shift day rejected successfully" })
}

exports.setShiftSettings = async (req, res) => {
    const userId = req.user._id
    const { groupId, personCount, hourCount, dayLimit } = req.body

    const userGroup = await groupModel.findOne({ _id: groupId, matron: userId })
    if (!userGroup)
        return res.status(404).json({ error: "User group not found" })

    await shiftSettingModel.create({ group: groupId, personCount, hourCount, dayLimit })
    res.status(201).json({ message: "Shift settings created successfully" })
}

exports.updateShiftSettings = async (req, res) => {
    const { id } = req.params
    const userId = req.user._id
    const { groupId, personCount, hourCount, dayLimit } = req.body

    const userGroup = await groupModel.findOne({ _id: groupId, matron: userId })
    if (!userGroup)
        return res.status(404).json({ error: "User group not found" })

    const shiftSetting = await shiftSettingModel.findOneAndUpdate({ _id: id, group: groupId },
        { personCount, hourCount, dayLimit }
    )
    if (!shiftSetting)
        return res.status(404).json({ error: "Shift setting not found" })
    res.status(201).json({ message: "Shift settings updated successfully" })
}

exports.setJobInfo = async (req, res) => {
    const matronId = req.user._id
    const { userId, groupId, post, employment, experience, hourReduction, promotionDuty, nonPromotionDuty } = req.body

    const userGroup = await groupModel.findOne({ _id: groupId, matron: matronId })
    if (!userGroup)
        return res.status(404).json({ error: "User group not found" })

    await jobInfoModel.create({ 
        user: userId, group: groupId,
        post, employment, experience,
        hourReduction, promotionDuty, nonPromotionDuty
     })
    res.status(201).json({ message: "Job info created successfully" })
}

exports.updateJobInfo = async (req, res) => {
    const { id } = req.params
    const matronId = req.user._id
    const { groupId, post, employment, experience, hourReduction, promotionDuty, nonPromotionDuty } = req.body

    const userGroup = await groupModel.findOne({ _id: groupId, matron: matronId })
    if (!userGroup)
        return res.status(404).json({ error: "User group not found" })

    const jobInfo = await jobInfoModel.findByIdAndUpdate(id, {
        post, employment, experience,
        hourReduction, promotionDuty, nonPromotionDuty
    })
    if(!jobInfo)
        return res.status(404).json({ error: "Job info not found" })
    
    res.status(201).json({ message: "Job info created successfully" })
}