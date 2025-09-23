const { isValidObjectId } = require("mongoose")
const moment = require("jalali-moment");

const shiftModel = require("./shift.model");
const groupModel = require("../group/group.model");
const shiftSettingModel = require("./shiftSetting.model");
const jobInfoModel = require("./jobInfo.model");
const shiftsTableModel = require("./shiftsTable.model");
const { getShiftDays, generateShiftsTable, getHourCountDay } = require("../utils/shiftDays");

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
          return res.status(400).json({ message: "برای دریافت جدول شیفت ها تنظیم اطلاعات شغلی پرستاران لازم است" });

      const shiftSetting = await shiftSettingModel.findOne({ group: groupId });
      if (!shiftSetting)
          return res.status(400).json({ message: "برای دریافت جدول شیفت ها تنظیمات شیفت لازم است" });

      const allShifts = await shiftModel.find({ group: groupId, month, year })
          .populate("user", "firstName lastName").lean();
      if(!allShifts.length)
        return res.status(400).json({ message: "هیچ شیفتی برای ماه مورد نظر وجود ندارد" })

      if(!shiftsTable){
        await shiftsTableModel.create({ 
          group: groupId, month, year,
          rows: generateShiftsTable(allShifts, allJobInfos, shiftSetting),
          totalHourDay: getHourCountDay(allShifts, shiftSetting.hourCount)
        })
      }else {
        shiftsTable.rows = generateShiftsTable(allShifts, allJobInfos, shiftSetting)
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
  const { groupId, shiftDays, month, year, description } = req.body;

  if(!isValidObjectId(groupId)) return res.status(422).json({ error: "Group id is not valid" })

  const userGroup = await groupModel.findOne({
    _id: groupId,
    $or: [{ members: { $all: [userId] } }, { matron: userId }],
  });
  if (!userGroup)
    return res.status(404).json({ error: "User group not found" });

  const shiftSetting = await shiftSettingModel.findOne({ group: groupId });
  if (!shiftSetting)
    return res.status(400).json({ message: "ارسال شیفت امکان پذیر نمی باشد" });

  if (Number(currentMonth) >= Number(month) || Number(currentDay) > shiftSetting.dayLimit)
    return res.status(400).json({ message: "مهلت ارسال شیفت به پایان رسیده است" });

  const shiftExist = await shiftModel.findOne({ user: userId, group: groupId, month, year })

  if(shiftExist && !shiftExist.temporal)
    return res.status(409).json({ message: "شیفت برای این گروه قبلا ارسال شده است" });
  else if(shiftExist && shiftExist.temporal) {
    await shiftExist.updateOne({ shiftDays, description, temporal: false })
    return res.json({ message: "Your shift created successfully" })
  }
  else if(!shiftExist) {
    await shiftModel.create({
      user: userId,
      group: groupId,
      shiftDays,
      month,
      year,
      description,
      temporal: false
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
    return res.status(400).json({ message: "ویرایش شیفت امکان پذیر نمی باشد" });

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
  if (shift.shiftDays.has(keyU)) {
    shift.shiftDays.get(keyU).push(numU)
  }else {
    shift.shiftDays.set(keyU, [numU])
  }
  
  await shift.save();

  res.json({ message: "Shift updated successfully" });
};

exports.getShiftReport = async (req, res) => {
  const userId = req.user._id;
  const { groupId, year, month } = req.params;

  const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup)
    return res.status(404).json({ error: "User group not found" });

  const groupShifts = await shiftModel.find({ group: groupId, year, month, expired: false 
    // , temporal: false
  })
    .populate("user", "firstName lastName mobile")
    .lean();

  res.json(getShiftDays(groupShifts));
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

exports.getUserShift = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  if(!isValidObjectId(id))
    return res.status(422).json({ error: "Shift id is not valid" })

  const formattedShiftDays = {}

  const userShift = await shiftModel.findOne({ _id: id, user: userId })
    .select("-description -rejects -__v")
    .populate("group", "province county hospital department")
    .lean();

  if(!userShift)
    return res.status(404).json({ error: "User shift not found" })

  for(const key in userShift.shiftDays){
    userShift.shiftDays[key].forEach(shiftDay => formattedShiftDays[shiftDay] = key)
  }
  
  res.json({ ...userShift, shiftDays: formattedShiftDays, currentShiftDays: userShift.shiftDays });
};

exports.getUserShiftDescription = async (req, res) => {
  const { id } = req.params;
  if(!isValidObjectId(id)) return res.status(422).json({ error: "Shift id is not valid" })

  const userShift = await shiftModel.findById(id)
    .select("description user")
    .populate("user", "firstName lastName")
    .lean();

  if(!userShift) return res.status(404).json({ error: "User shift not found" })
  res.json(userShift)
}

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
    await shiftSettingModel.create({
      group: groupId,
      personCount,
      hourCount,
      dayLimit,
    });
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
    userId,
    groupId,
    post,
    employment,
    experience,
    hourReduction,
    promotionDuty,
    nonPromotionDuty,
  } = req.body;

  const userGroup = await groupModel.findOne({
    _id: groupId,
    $and: [{ members: { $all: [userId] } }, { matron: matronId }],
  });
  if (!userGroup) return res.status(404).json({ error: "User group not found" });

  const jobInfo = await jobInfoModel.findOneAndUpdate({ group: groupId, user: userId }, {
    post,
    employment,
    experience,
    hourReduction,
    promotionDuty,
    nonPromotionDuty,
  });
  if (!jobInfo){
    await jobInfoModel.create({
      user: userId,
      group: groupId,
      post,
      employment,
      experience,
      hourReduction,
      promotionDuty,
      nonPromotionDuty
    });
  return res.status(201).json({ message: "Job info created successfully" });
  }
  res.json({ message: "Job info updated successfully" });
};
