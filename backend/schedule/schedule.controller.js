const { isValidObjectId } = require("mongoose")
const moment = require("jalali-moment");
const { orderBy } = require("lodash")

const shiftModel = require("../shift/shift.model");
const groupModel = require("../group/group.model");
const shiftSettingModel = require("../shift/shiftSetting.model");
const jobInfoModel = require("../shift/jobInfo.model");
const shiftsTableModel = require("./shiftsTable.model");
const subGroupModel = require('../group/subGroup.model')
const shiftScheduleModel = require("./shiftSchedule.model")
const { getShiftDays, generateShiftsTable, getHourCountDay } = require("../utils/shiftDays");
const { applyShiftsCounts, getUserShiftCount } = require('../utils/schedule/shiftCounts')
const { applyPersonCounts } = require('../utils/schedule/personCounts')

const currentYear = moment(new Date()).locale("fa").format("jYYYY");
const currentMonth = moment(new Date()).locale("fa").format("jMM");
const currentDay = moment(new Date()).locale("fa").format("jDD");
const shiftMonth = Number(currentMonth) + 1 > 12 ? 1 : Number(currentMonth) + 1
const shiftYear = shiftMonth > 12 ? Number(currentYear) + 1 : Number(currentYear)


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
      if (!allJobInfos.length)
        return res.status(400).json({ message: "اطلاعات شغلی پرستاران تنظیم نشده است" });

      const shiftSetting = await shiftSettingModel.findOne({ group: groupId });
      if (!shiftSetting)
        return res.status(400).json({ message: "برای دریافت جدول شیفت ها تنظیمات شیفت لازم است" });

      const allShifts = await shiftModel.find({ group: groupId, month, year })
        .populate("user", "firstName lastName").lean();
      if(!allShifts.length)
        return res.status(400).json({ message: "هیچ شیفتی برای ماه مورد نظر وجود ندارد" })

      const shiftsTableRows = generateShiftsTable(allShifts, allJobInfos, shiftSetting)

      if(!shiftsTable){
        await shiftsTableModel.create({ 
          group: groupId, month, year,
          rows: orderBy(shiftsTableRows, ['experience'], ['desc']),
          totalHourDay: getHourCountDay(allShifts, shiftSetting.hourCount)
        })
      }else {
        shiftsTable.rows = orderBy(shiftsTableRows, ['experience'], ['desc'])
        shiftsTable.totalHourDay = getHourCountDay(allShifts, shiftSetting.hourCount)
        shiftsTable.save()
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

exports.createShiftsSchedule = async (req, res) => {
    const userId = req.user._id;

    const { groupId, month, year } = req.body;

    if(!isValidObjectId(groupId)) return res.status(422).json({ error: "Group id is not valid" })
    const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
    if (!userGroup) return res.status(404).json({ error: "User group not found" });
    
    const shiftSetting = await shiftSettingModel.findOne({ group: groupId });
    if (!shiftSetting) return res.status(400).json({ message: "تنظیمات شیفت انجام نشده است" });

    const allJobInfos = await jobInfoModel.find({ group: groupId }).lean();
    if (!allJobInfos.length) return res.status(400).json({ message: "اطلاعات شغلی پرستاران تنظیم نشده است" });

    const subGroup = await subGroupModel.findOne({ group: groupId }).lean()
    if (!subGroup) return res.status(400).json({ message: "هیچ زیرگروهی تعیین نشده است" });

    const allShifts = await shiftModel.find({ group: groupId, month, year })
        .populate("user", "firstName lastName").lean();
    if(!allShifts.length) return res.status(400).json({ message: "هیچ درخواست شیفتی وجود ندارد" })

    const allMonthShifts = []

    allShifts.forEach(shift => {
        const stdShiftsCounts = getUserShiftCount(shift.user._id.toString(), subGroup.subs)
        if(!stdShiftsCounts) return res.status(400).json({ message: "برای همه پرستاران زیرگروه تعیین نشده است" });

        const monthShifts = applyShiftsCounts(shift.shiftDays, stdShiftsCounts, year, month, shift.favCS)
        allMonthShifts.push({ user: shift.user._id, monthShifts })
    })

    const monthSchedule = applyPersonCounts(allMonthShifts, shiftSetting.personCount, year, month)

    const shiftSchedule = await shiftScheduleModel.findOneAndUpdate({ group: groupId }, { monthSchedule })
    if(!shiftSchedule) {
        await shiftScheduleModel.create({ group: groupId, monthSchedule })
        return res.status(201).json({ message: "Shift schedule created successful" })
    }
    return res.json({ message: "Shift schedule set successful" })
}

exports.updateShiftsSchedule = async () => {}