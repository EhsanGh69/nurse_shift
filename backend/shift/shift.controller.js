const { isValidObjectId } = require("mongoose")
const moment = require("jalali-moment");

const shiftModel = require("./shift.model");
const groupModel = require("../group/group.model");
const shiftSettingModel = require("./shiftSetting.model");
const jobInfoModel = require("./jobInfo.model");
const subGroupModel = require('../group/subGroup.model')
const { getMonthShifts } = require("../utils/shiftDays");
const { getUserShiftCount } = require('../utils/schedule/shiftProvider');
const { getIsHolidaysMap } = require("../utils/schedule/helpers");

const currentYear = moment(new Date()).locale("fa").format("jYYYY");
const currentMonth = moment(new Date()).locale("fa").format("jMM");
const currentDay = moment(new Date()).locale("fa").format("jDD");
const shiftMonth = Number(currentMonth) + 1 > 12 ? 1 : Number(currentMonth) + 1
const shiftYear = shiftMonth > 12 ? Number(currentYear) + 1 : Number(currentYear)


exports.saveShift = async (req, res) => {
  const userId = req.user._id;
  const { groupId, shiftDays, month, year } = req.body;

  if(!isValidObjectId(groupId)) return res.status(422).json({ error: "Group id is not valid" })

  const userGroup = await groupModel.findOne({ _id: groupId, 
    $or: [{ members: { $all: [userId] } }, { matron: userId }]});
  if (!userGroup)
    return res.status(404).json({ error: "User group not found" });

  const shiftExist = await shiftModel.findOneAndUpdate(
    { user: userId, group: groupId, month, year, temporal: true }, 
    {shiftDays}
  )
  if(!shiftExist) {
    await shiftModel.create({
      user: userId,
      group: groupId,
      shiftDays,
      month,
      year
    });
    return res.status(201).json({ message: "Shift saved successfully" });
  }
  res.json({ message: "Shift saved successfully" });
}

exports.createShift = async (req, res) => {
  const userId = req.user._id;
  const { groupId, shiftDays, month, year, description, favCS } = req.body;

  if(!isValidObjectId(groupId)) return res.status(422).json({ error: "Group id is not valid" })
  const userGroup = await groupModel.findOne({ _id: groupId,
    $or: [{ members: { $all: [userId] } }, { matron: userId }],
  });
  if (!userGroup) return res.status(404).json({ error: "User group not found" });

  const shiftSetting = await shiftSettingModel.findOne({ group: groupId });
  if (!shiftSetting) return res.status(400).json({ message: "ارسال شیفت امکان پذیر نمی باشد" });

  const subGroup = await subGroupModel.findOne({ group: groupId }).lean()
  if (!subGroup || !getUserShiftCount(userId.toString(), subGroup.subs)) 
    return res.status(400).json({ message: "ارسال شیفت امکان پذیر نمی باشد" });

  if (Number(currentMonth) >= Number(month) || Number(currentDay) > shiftSetting.dayLimit)
    return res.status(400).json({ message: "مهلت ارسال شیفت به پایان رسیده است" });

  const userShiftCount = getUserShiftCount(userId.toString(), subGroup.subs)

  if(userShiftCount.CS[0] >= 0 && userShiftCount.CS[1] > 1 && !favCS)
    return res.status(400).json({ message: "انتخاب شیفت ترکیبی مورد علاقه الزامی می باشد" });
  
  const shiftExist = await shiftModel.findOne({ user: userId, group: groupId, month, year })
  if(shiftExist && !shiftExist.temporal)
    return res.status(409).json({ message: "شیفت برای این گروه قبلا ارسال شده است" });
  else if(shiftExist && shiftExist.temporal) {
    await shiftExist.updateOne({ shiftDays, description, favCS, temporal: false })
    return res.json({ message: "Your shift created successfully" })
  }
  else if(!shiftExist) {
    await shiftModel.create({ user: userId, group: groupId, shiftDays,
      month, year, description, favCS, temporal: false
    });
    return res.status(201).json({ message: "Shift created successfully" });
  }
};

exports.updateShift = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { groupId, shiftDay } = req.body;

  const userGroup = await groupModel.findOne({ _id: groupId, matron: user._id });
  if (!userGroup)
    return res.status(404).json({ error: "User group not found" });

  const shiftSetting = await shiftSettingModel.findOne({ group: groupId });
  if (!shiftSetting)
    return res.status(400).json({ message: "تنظیمات شیفت انجام نشده است" });

  const shift = await shiftModel.findOne({ _id: id, group: groupId });
  if (!shift) return res.status(404).json({ error: "Shift not found" });

  // remove current shiftDay
  const matchCurrent = shiftDay.current.match(/^([A-Z]+)(\d{1,2})$/);
  const [_C, keyC, numStrC] = matchCurrent;
  const numC = parseInt(numStrC, 10);
  if (shift.shiftDays.has(keyC)) {
    const filterValues = shift.shiftDays.get(keyC).filter((day) => day !== numC)
    if(filterValues.length > 0)
      shift.shiftDays.set(keyC, filterValues)
    else
      shift.shiftDays.delete(keyC)
  }

  // add update shiftDay
  const matchUpdate = shiftDay.update.match(/^([A-Z]+)(\d{1,2})$/);
  const [_U, keyU, numStrU] = matchUpdate;
  const numU = parseInt(numStrU, 10);
  const isHoliday = !!getIsHolidaysMap(shift.year, shift.month)[numU - 1]
  if (shift.shiftDays.has(keyU)) {
    shift.shiftDays.get(keyU).push(numU)
  }else {
    if(isHoliday && !keyU.includes("H")) shift.shiftDays.set(`${keyU}H`, [numU])
    else shift.shiftDays.set(keyU, [numU])
  }
  
  await shift.save();

  res.json({ message: "Shift updated successfully" });
};

exports.getRequestedShifts = async (req, res) => {
  const userId = req.user._id;
  const { groupId, year, month } = req.params;

  const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup)
    return res.status(404).json({ error: "User group not found" });

  const groupShifts = await shiftModel.find({ group: groupId, year, month, expired: false })
    .populate("user", "firstName lastName").lean();

  res.json(getMonthShifts(groupShifts));
};

exports.changeShiftsTemporal = async (req, res) => {
  const userId = req.user._id;
  const { shiftId, groupId } = req.body;

  if(!isValidObjectId(groupId) || !isValidObjectId(shiftId)) 
    return res.status(422).json({ error: "Object id is not valid" })

  const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup) return res.status(404).json({ error: "User group not found" });

  const userShift = await shiftModel.findById(shiftId)
  if (!userShift) return res.status(404).json({ error: "User shift not found" });

  userShift.temporal = !userShift.temporal
  userShift.save()

  res.json({ message: "Shift temporal changed successfully" });
};

exports.getUserShifts = async (req, res) => {
  const userId = req.user._id;
  const { groupId } = req.params;
  const { year, month } = req.query;

  if(!isValidObjectId(groupId)) return res.status(422).json({ error: "Group id is not valid" })

  const userShifts = await shiftModel.find({ user: userId, group: groupId })
    .populate("group", "province county hospital department")
    .lean();

  const haveShift = userShifts.some(shift => {
    return shift.year === String(shiftYear)  && shift.month === String(shiftMonth)
  })

  let filteredShifts = []

  if(year && !month){
    filteredShifts = userShifts.filter(shift => shift.year === String(year))
    return res.json({ shifts: filteredShifts, haveShift })
  }

  if(year && month){
    filteredShifts = userShifts.filter(shift => shift.year === String(year) && shift.month === String(month))
    return res.json({ shifts: filteredShifts, haveShift })
  }

  if(!year && !month) return res.status(400).json({ error: "Year query is required" })
};

exports.getDayLimit = async (req, res) => {
  const userId = req.user._id;
  const { groupId } = req.params;

  const userGroup = await groupModel.findOne({ _id: groupId,
    $or: [{ members: { $all: [userId] } }, { matron: userId }],
  });
  if (!userGroup) return res.status(404).json({ error: "User group not found" });

  const shiftSetting = await shiftSettingModel.findOne({ group: groupId });
  if (!shiftSetting) return res.status(403).json({ message: "انتخاب شیفت امکان پذیر نمی باشد" });

  res.json({ dayLimit: shiftSetting.dayLimit })
}

exports.getUserShift = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  if(!isValidObjectId(id))
    return res.status(422).json({ error: "Shift id is not valid" })

  const formattedShiftDays = {}

  const userShift = await shiftModel.findOne({ _id: id, user: userId })
    .select("-rejects -__v")
    .populate("group", "province county hospital department")
    .lean();

  if(!userShift)
    return res.status(404).json({ error: "User shift not found" })

  for(const key in userShift.shiftDays){
    userShift.shiftDays[key].forEach(shiftDay => formattedShiftDays[shiftDay] = key)
  }
  
  res.json({ ...userShift, shiftDays: formattedShiftDays, currentShiftDays: userShift.shiftDays });
};

exports.checkShiftExpiration = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  if(!isValidObjectId(id))
    return res.status(422).json({ error: "Shift id is not valid" })

  const userShift = await shiftModel.findOne({ _id: id, user: userId })
  if(!userShift) return res.status(404).json({ error: "User shift not found" })

  if(Number(currentMonth) >= Number(userShift.month)){
    userShift.expired = true
    await userShift.save()
  }
  res.json({ message: "Shift expiration checked successfully" })
}

exports.rejectShiftDay = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const { groupId, shiftDay } = req.body;

  const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup) return res.status(404).json({ error: "User group not found" });

  const shift = await shiftModel.findById(id);
  if (!shift) return res.status(404).json({ error: "Shift not found" });

  shift.rejects.push(shiftDay);
  const match = shiftDay.match(/^([A-Z]+)(\d{1,2})$/);
  const [_, key, numStr] = match;
  const num = parseInt(numStr, 10);
  if (shift.shiftDays.has(key)) {
    const filterValues = shift.shiftDays.get(key).filter((day) => day !== num)
    if(filterValues.length > 0)
      shift.shiftDays.set(key, filterValues)
    else
      shift.shiftDays.delete(key)
  }

  await shift.save();

  res.json({ message: "Shift day rejected successfully" });
};

exports.getRejectedShiftDays = async (req, res) => {
  const userId = req.user._id;
  const { groupId, id } = req.params;

  if(!isValidObjectId(groupId)) return res.status(422).json({ error: "Group id is not valid" })
  if(!isValidObjectId(id)) return res.status(422).json({ error: "Shift id is not valid" })

  const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup)
    return res.status(404).json({ error: "User group not found" });

  const shift = await shiftModel.findOne({ _id: id, group: groupId });
  if (!shift) return res.status(404).json({ error: "Shift not found" });

  res.json({ rejects: shift.rejects })
}

exports.setShiftSettings = async (req, res) => {
  const userId = req.user._id;
  const { groupId, personCount, hourCount, dayLimit } = req.body;

  const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup) return res.status(404).json({ error: "User group not found" });

  const shiftSetting = await shiftSettingModel.findOneAndUpdate(
    { group: groupId },
    { personCount, hourCount, dayLimit }
  );
  if (!shiftSetting){
    await shiftSettingModel.create({ group: groupId,personCount,hourCount,dayLimit });
    return res.status(201).json({ message: "Shift settings created successfully" });
  }
  res.json({ message: "Shift settings updated successfully" });
};

exports.getShiftSettings = async (req, res) => {
  const userId = req.user._id;
  const { groupId } = req.params;

  const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup) return res.status(404).json({ error: "User group not found" });

  const groupSiftSettings = await shiftSettingModel.findOne({ group: groupId });

  res.json(groupSiftSettings);
};

exports.getJobInfos = async (req, res) => {
  const userId = req.user._id;
  const { groupId } = req.params;

  const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup) return res.status(404).json({ error: "User group not found" });

  const jobInfos = await jobInfoModel.find({ group: groupId })
  .populate("user", "firstName lastName avatar")
  .lean();

  res.json(jobInfos);
};

exports.setJobInfo = async (req, res) => {
  const matronId = req.user._id;
  const { 
    userId, groupId, post, employment, shiftManager,
    experience, hourReduction, promotionDuty, nonPromotionDuty,
  } = req.body;
  const userGroup = String(matronId) === String(userId)
    ? await groupModel.findOne({ _id: groupId, matron: matronId })
    : await groupModel.findOne({
        _id: groupId, 
        $and: [{ members: { $all: [userId] } }, { matron: matronId  }]
    })
  if (!userGroup) return res.status(404).json({ error: "User group not found" });

  const jobInfo = await jobInfoModel.findOneAndUpdate(
    { group: groupId, user: userId }, 
    { post, employment, experience, hourReduction, promotionDuty, nonPromotionDuty, shiftManager}
  );
  if (!jobInfo){
    await jobInfoModel.create({
      user: userId,group: groupId, post, employment, shiftManager,
      experience,hourReduction,promotionDuty,nonPromotionDuty
    });
    return res.status(201).json({ message: "Job info created successfully" });
  }
  res.json({ message: "Job info updated successfully" });
};
