const { isValidObjectId } = require("mongoose")
const moment = require("jalali-moment");
const { orderBy } = require("lodash")

const shiftModel = require("../shift/shift.model");
const groupModel = require("../group/group.model");
const shiftSettingModel = require("../shift/shiftSetting.model");
const jobInfoModel = require("../shift/jobInfo.model");
const shiftsTableModel = require("./shiftsTable.model");
const maxShiftsModel = require('../group/maxShifts.model')
const shiftScheduleModel = require("./shiftSchedule.model")
const { generateShiftsTable, getHourCountDay } = require("../utils/shiftDays");
const { requestedMonthShifts, scheduleSorter, convertToArray } = require('../utils/schedule/shiftProvider')
const { primarySchedule, finalSchedule } = require('../utils/schedule/shiftsSchedule')
const { generateMaxAllowed } = require('../utils/schedule/maxAllowed')
const { daysInJalaliMonth } = require('../utils/schedule/helpers')

const currentYear = moment(new Date()).locale("fa").format("jYYYY");
const currentMonth = moment(new Date()).locale("fa").format("jMM");
// const shiftMonth = Number(currentMonth) + 1 > 12 ? 1 : Number(currentMonth) + 1
// const shiftYear = shiftMonth > 12 ? Number(currentYear) + 1 : Number(currentYear)
const shiftMonth = Number(currentMonth)
const shiftYear = Number(currentYear)

exports.refreshShiftsTables = async (req, res) => {
  const userId = req.user._id;
  const { groupId, month, year } = req.body;

  if(!isValidObjectId(groupId)) return res.status(422).json({ error: "Group id is not valid" })

  const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup) return res.status(404).json({ error: "User group not found" });

  const shiftsTable = await shiftsTableModel.findOne({ group: groupId, month, year })

  const checkShiftExpire = year > shiftYear || month > shiftMonth

  if(!shiftsTable || !checkShiftExpire) {
      const allJobInfos = await jobInfoModel.find({ group: groupId }).lean();
      if (allJobInfos.length < userGroup.members.length + 1)
        return res.status(400).json({ message: "اطلاعات شغلی پرستاران تنظیم نشده است" });

      const shiftSetting = await shiftSettingModel.findOne({ group: groupId });
      if (!shiftSetting)
        return res.status(400).json({ message: "برای دریافت جدول شیفت ها تنظیمات شیفت لازم است" });

      const shiftSchedule = await shiftScheduleModel.findOne({ group: groupId, month })
        .populate("monthSchedule.user", "firstName lastName").lean();
      if(!shiftSchedule || shiftSchedule.monthSchedule.length !== userGroup.members.length + 1) 
      return res.status(400).json({ message: "درخواست شیفت های پرستاران اعمال نشده است" })

      const shiftsTableRows = generateShiftsTable(shiftSchedule.monthSchedule, allJobInfos, shiftSetting.hourCount)

      if(!shiftsTable){
        await shiftsTableModel.create({ 
          group: groupId, month, year,
          rows: orderBy(shiftsTableRows, ['experience'], ['desc']),
          totalHourDay: getHourCountDay(shiftSchedule.monthSchedule, shiftSetting.hourCount)
        })
      }else {
        shiftsTable.rows = orderBy(shiftsTableRows, ['experience'], ['desc'])
        shiftsTable.totalHourDay = getHourCountDay(shiftSchedule.monthSchedule, shiftSetting.hourCount)
        await shiftsTable.save()
      }
  }
  res.json({ message: "Shifts tables refreshed successfully" })
}

exports.getShiftsTable = async (req, res) => {
  const { id } = req.params;
  if(!isValidObjectId(id)) return res.status(422).json({ error: "Table id is not valid" })

  const shiftsTable = await shiftsTableModel.findById(id)
  .populate("group", "province county hospital department").lean()
  if(!shiftsTable) return res.status(404).json({ error: "Shifts table not found" })
  res.json(shiftsTable)
};

exports.getAllShiftsTables = async (req, res) => {
    const userId = req.user._id;
    const { groupId } = req.params;
    const { year, month } = req.query;

    if(!isValidObjectId(groupId)) return res.status(422).json({ error: "Group id is not valid" })

    const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
    if (!userGroup) return res.status(404).json({ error: "User group not found" });

    const shiftsTables = await shiftsTableModel.find({ group: groupId }).lean()

    let filteredShiftsTables = []

    if(year && !month){
      filteredShiftsTables = shiftsTables.filter(sTable => sTable.year === String(year))
      return res.json(filteredShiftsTables)
    }

    if(year && month){
      filteredShiftsTables = shiftsTables.filter(sTable => sTable.year === String(year) && sTable.month === String(month))
      return res.json(filteredShiftsTables)
    }

    if(!year && !month) return res.status(400).json({ error: "Year query is required" })
}

exports.createPrimaryShiftsSchedule = async (req, res) => {
  const userId = req.user._id;
  const { groupId, month, year } = req.body;

  if(!isValidObjectId(groupId)) return res.status(422).json({ error: "Group id is not valid" })
  const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup) return res.status(404).json({ error: "User group not found" });

  const shiftSchedule = await shiftScheduleModel.findOne({ group: groupId })
  if (!shiftSchedule) return res.status(404).json({ error: "Shifts schedule not found" });

  const shiftSetting = await shiftSettingModel.findOne({ group: groupId });
  if (!shiftSetting) return res.status(400).json({ message: "تنظیمات شیفت انجام نشده است" });

  const allJobInfos = await jobInfoModel.find({ group: groupId }).lean();
  if (!allJobInfos.length) return res.status(400).json({ message: "اطلاعات شغلی هیچ پرستاری تنظیم نشده است" });
  if(allJobInfos.length !== userGroup.members.length + 1) 
    return res.status(400).json({ message: "اطلاعات شغلی همه پرستاران تنظیم نشده است" })

  const maxShifts = await maxShiftsModel.findOne({ group: groupId }).lean()
  if(maxShifts.members.length !== userGroup.members.length) 
    return res.status(400).json({ message: "حداکثر مجاز شیفت پرستاران تنظیم نشده است" });

  const allShifts = await shiftModel.find({ group: groupId, month, year, temporal: false, expired: false })
    .populate("user", "firstName lastName").lean();
  if(!allShifts.length) return res.status(400).json({ message: "هیچ درخواست شیفتی وجود ندارد" })
  if(allShifts.length !== userGroup.members.length + 1) 
    return res.status(400).json({ message: "همه پرستاران درخواست شیفت های خود را ارسال نکرده اند" })
  if(allShifts.some(userShifts => !userShifts.confirm)) 
    return res.status(400).json({ message: "همه درخواست شیفت های پرستاران تایید نشده اند" })

  const maxAllowed = generateMaxAllowed(maxShifts.members)

  const matronStaff = []
  allJobInfos.forEach(info => {
    if(info.post === 1 || info.post === 2) matronStaff.push(String(info.user))
  })

  const allRequestedShifts = requestedMonthShifts(allShifts, matronStaff, year, month)
  const sortedMonthShifts = scheduleSorter(allRequestedShifts, allJobInfos)
  const primarySch = primarySchedule(sortedMonthShifts, 
    { stdPersonCount: shiftSetting.personCount, maxAllowed }, { year, month })
  
  shiftSchedule.monthSchedule = primarySch
  shiftSchedule.month = month
  await shiftSchedule.save()
  return res.json({ message: "Primary shifts schedule created successfully" })
}

exports.createFinalShiftsSchedule = async (req, res) => {
    const userId = req.user._id;
    const { groupId, month, year } = req.body;

    if(!isValidObjectId(groupId)) return res.status(422).json({ error: "Group id is not valid" })
    const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
    if (!userGroup) return res.status(404).json({ error: "User group not found" });

    const shiftSchedule = await shiftScheduleModel.findOne({ group: groupId, month }).lean()
    if(!shiftSchedule) return res.status(404).json({ error: "Shift schedule not found" })

    const shiftSetting = await shiftSettingModel.findOne({ group: groupId });
    if (!shiftSetting) return res.status(400).json({ message: "تنظیمات شیفت انجام نشده است" });
    
    const allJobInfos = await jobInfoModel.find({ group: groupId }).lean();
    if (!allJobInfos.length) return res.status(400).json({ message: "اطلاعات شغلی پرستاران تنظیم نشده است" });
    
    const maxShifts = await maxShiftsModel.findOne({ group: groupId }).lean()
    if(maxShifts.members.length !== userGroup.members.length) 
      return res.status(400).json({ message: "حداکثر مجاز شیفت پرستاران تنظیم نشده است" });
    
    const allShifts = await shiftModel.find({ group: groupId, month, year, temporal: false, expired: false })
    .populate("user", "firstName lastName").lean();

    const maxAllowed = generateMaxAllowed(maxShifts.members)
    const matronStaff = []
    allJobInfos.forEach(info => {
      if(info.post === 1 || info.post === 2) matronStaff.push(String(info.user))
    })
    const allRequestedShifts = requestedMonthShifts(allShifts, matronStaff, year, month)
    const { allMonthShifts: finalSch, finalPersonCounts } = finalSchedule(
      {requestedShifts: allRequestedShifts, allMonthShifts: convertToArray(shiftSchedule.monthSchedule)}, 
      { stdPersonCount: shiftSetting.personCount, maxAllowed }, { year, month })

    await shiftScheduleModel.updateOne({ group: groupId, month }, { monthSchedule: finalSch })
 
    return res.json({ shortage: finalPersonCounts.shortage, surplus: finalPersonCounts.surplus })
}

exports.checkShiftsSchedule = async (req, res) => {
  const userId = req.user._id;
  const { groupId, month } = req.params;

  
  if(!isValidObjectId(groupId)) return res.status(422).json({ error: "Group id is not valid" })
    const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup) return res.status(404).json({ error: "User group not found" });
  
  let executable = false
  const shiftSchedule = await shiftScheduleModel.findOne({ group: groupId, month }).lean()
  if(shiftSchedule && shiftSchedule.monthSchedule.length === userGroup.members.length + 1) executable = true
  res.json({ executable })
}

exports.updateShiftsSchedule = async (req, res) => {
  const userId = req.user._id;
  const { groupId, memberId, shiftDay, shiftType } = req.body;

  const group = String(userId) === String(memberId)
    ? await groupModel.findOne({ _id: groupId, matron: userId })
    : await groupModel.findOne({
        _id: groupId, 
        $and: [{ members: { $all: [memberId] } }, { matron: userId  }]
    })
    if(!group) return res.status(404).json({ error: "User group not found" });

  const shiftSchedule = await shiftScheduleModel.findOne({ group: groupId })
  if(!shiftSchedule) return res.status(404).json({ error: "Shift schedule not found" });

  const monthSchedule = [ ...shiftSchedule.monthSchedule ]

  const schIndex = monthSchedule.findIndex(sch => sch.user.toString() === String(memberId))
  if(schIndex === -1) return res.status(404).json({ error: "User schedule not found" });

  monthSchedule[schIndex].monthShifts[shiftDay - 1] 
  ? monthSchedule[schIndex].monthShifts[shiftDay - 1][1] = shiftType
  : monthSchedule[schIndex].monthShifts[shiftDay - 1] = { 0: shiftDay, 1: shiftType}
  shiftSchedule.monthSchedule = monthSchedule
  await shiftSchedule.save()

  res.status(200).json({ message: "Shift schedule updated successfully" })
      
}

exports.getShiftSchedule = async (req, res) => {
  const userId = req.user._id;
  const { groupId, day } = req.params;

  if(!isValidObjectId(groupId)) return res.status(422).json({ error: "Group id is not valid" })
  const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup) return res.status(404).json({ error: "User group not found" });

  const shiftSetting = await shiftSettingModel.findOne({ group: groupId });
  if (!shiftSetting) return res.status(400).json({ message: "تنظیمات شیفت انجام نشده است" });

  const allJobInfos = await jobInfoModel.find({ group: groupId }).lean();
  if (!allJobInfos.length) return res.status(400).json({ message: "اطلاعات شغلی پرستاران تنظیم نشده است" });

  const shiftSchedule = await shiftScheduleModel.findOne({ group: groupId })
  .populate("monthSchedule.user", "firstName lastName")
  .lean()
  if(!shiftSchedule) return res.status(404).json({ error: "Shift schedule not found" });

  const shiftDaySchedule = {}
  shiftSchedule.monthSchedule.forEach(sch => {
    sch.monthShifts.forEach(dayShift => {
      if(dayShift !== null && dayShift[0] === Number(day)){
        const shiftType = dayShift[1]
        if(shiftDaySchedule[shiftType]) shiftDaySchedule[shiftType].push(sch.user)
        else shiftDaySchedule[shiftType] = [sch.user]
      }
    })
  })

  const allShifts = await shiftModel.find({ group: groupId, month: String(shiftMonth), year: String(shiftYear), 
    temporal: false, expired: false }).lean();

    const requestedDays = {}
    for (let day = 1; day <= daysInJalaliMonth(shiftYear, shiftMonth); day++) { requestedDays[day] = {} }
    if(allShifts.length){
        for (const user of allShifts) {
          const userShifts = { ...user.shiftDays }
          for (let day = 1; day <= daysInJalaliMonth(shiftYear, shiftMonth); day++) {
            for (const shift in userShifts) {
              requestedDays[day][shift] = []
              if (userShifts[shift].includes(day)) requestedDays[day][shift].push(user.user)
            }
          }
        }
    }
  res.json({ shiftDaySchedule, allRequests: requestedDays })
}