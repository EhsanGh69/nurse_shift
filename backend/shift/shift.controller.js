const moment = require("jalali-moment");

const shiftModel = require("./shift.model");
const groupModel = require("../group/group.model");
const shiftSettingModel = require("./shiftSetting.model");
const jobInfoModel = require("./jobInfo.model");
const shiftsTableModel = require("./shiftsTable.model");
const { getShiftDays, generateShiftsTable } = require("../utils/shiftDays");

const currentYear = moment(new Date()).locale("fa").format("jYYYY");
const currentMonth = moment(new Date()).locale("fa").format("jMM");
const currentDay = moment(new Date()).locale("fa").format("jDD");


exports.getShiftsTable = async (req, res) => {
    const userId = req.user._id;
    const { groupId, month, year } = req.params;

    const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
    if (!userGroup)
        return res.status(404).json({ error: "User group not found" });

    const shiftsTable = await shiftsTableModel.findOne({ group: groupId, month, year })

    if(!shiftsTable) {
        const allJobInfos = await jobInfoModel.find({ group: groupId }).lean();
        if (!allJobInfos.length)
            return res.status(400).json({ message: "برای دریافت جدول شیفت ها تنظیم اطلاعات شغلی پرستاران لازم است" });

        const shiftSetting = await shiftSettingModel.findOne({ group: groupId });
        if (!shiftSetting)
            return res.status(400).json({ message: "برای دریافت جدول شیفت ها تنظیمات شیفت لازم است" });

        const allShifts = await shiftModel.find({ group: groupId, month, year })
            .populate("user", "firstName lastName").lean();

        const newSiftsTable = await shiftsTableModel.create({ 
            group: groupId, month, year,
            rows: generateShiftsTable(allShifts, allJobInfos, shiftSetting)
        })

        return res.status(201).json(newSiftsTable)
    }
    
    res.json(shiftsTable)
};

exports.getAllShiftsTables = async (req, res) => {
    const userId = req.user._id;
    const { groupId } = req.params;

    const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
    if (!userGroup)
        return res.status(404).json({ error: "User group not found" });

    const shiftsTables = await shiftsTableModel.find({ group: groupId })
    res.json(shiftsTables)
}

exports.updateShiftsTable = async (req, res) => {
    const userId = req.user._id;
    const { groupId, month, year } = req.params;

    const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
    if (!userGroup)
        return res.status(404).json({ error: "User group not found" });

    if(Number(currentYear) > Number(year) || Number(currentMonth) > Number(month))
        return res.status(400).json({ message: "جدول شیفت مورد نظر منقضی شده و قابل ویرایش نمی باشد"})

    const allJobInfos = await jobInfoModel.find({ group: groupId }).lean();
    const shiftSetting = await shiftSettingModel.findOne({ group: groupId }).lean();
    const allShifts = await shiftModel.find({ group: groupId, month, year })
        .populate("user", "firstName lastName").lean();

    const updatedSiftsTable = await shiftsTableModel.findOneAndUpdate({ group: groupId, month, year }, 
        { rows: generateShiftsTable(allShifts, allJobInfos, shiftSetting) })
    if(!updatedSiftsTable)
        return res.status(404).json({ message: "جدول شیفت مورد نظر یافت نشد" })

    res.json(updatedSiftsTable)
}

exports.saveShift = async (req, res) => {
  const userId = req.user._id;
  const { groupId, shiftDays, month, year } = req.body;

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

  const userGroup = await groupModel.findOne({
    _id: groupId,
    $or: [{ members: { $all: [userId] } }, { matron: userId }],
  });
  if (!userGroup)
    return res.status(404).json({ error: "User group not found" });

  const shiftSetting = await shiftSettingModel.findOne({ group: groupId });
  if (!shiftSetting)
    return res.status(400).json({ message: "ارسال شیفت امکان پذیر نمی باشد" });

  if (Number(currentDay) > shiftSetting.dayLimit)
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
  const { groupId, shiftDays, description } = req.body;

  const userGroup = await groupModel.findOne({ _id: groupId, matron: user._id });
  if (!userGroup)
    return res.status(404).json({ error: "User group not found" });

  const shiftSetting = await shiftSettingModel.findOne({ group: groupId });
  if (!shiftSetting)
    return res.status(400).json({ message: "ویرایش شیفت امکان پذیر نمی باشد" });

  const shift = await shiftModel.findOne({ _id: id, group: groupId });
  if (!shift) return res.status(404).json({ error: "Shift not found" });

  if (Number(currentYear) >= Number(shift.year) || Number(currentMonth) > Number(shift.month)) {
        shift.expired = true;
        await shift.save();
  }

  shift.shiftDays = shiftDays;
  shift.description = description;
  await shift.save();

  res.json({ message: "Shift updated successfully" });
};

exports.getShiftReport = async (req, res) => {
  const userId = req.user._id;
  const { groupId } = req.params;

  const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup)
    return res.status(404).json({ error: "User group not found" });

  const groupShifts = await shiftModel
    .find({ group: groupId, expired: false })
    .populate("user", "firstName lastName mobile")
    .lean();

  res.json(getShiftDays(groupShifts));
};

exports.getUserShifts = async (req, res) => {
  const userId = req.user._id;
  const { year, month } = req.query;

  const userShifts = await shiftModel
    .find({ user: userId })
    .populate("group", "province county hospital department")
    .lean();

  const shiftMonth = Number(currentMonth) + 1 > 12 ? 1 : Number(currentMonth) + 1
  const shiftYear = shiftMonth > 12 ? Number(currentYear) + 1 : Number(currentYear)

  const monthCount = userShifts.filter(shift => {
    return shift.year === String(shiftYear)  && shift.month === String(shiftMonth)
  }).length

  let filteredShifts = []

  if(year && !month){
    filteredShifts = userShifts.filter(shift => shift.year === String(year))
    return res.json({ shifts: filteredShifts, monthCount, totalCount: userShifts.length })
  }

  if(year && month){
    filteredShifts = userShifts.filter(shift => shift.month === String(month))
    return res.json({ shifts: filteredShifts, monthCount, totalCount: userShifts.length })
  }
};

exports.getUserShift = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const formattedShiftDays = {}

  const userShift = await shiftModel
    .findOne({ _id: id, user: userId })
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

exports.rejectShiftDay = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const { groupId, shiftDay } = req.body;

  const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup)
    return res.status(404).json({ error: "User group not found" });

  const shift = await shiftModel.findOne({ _id: id, group: groupId });
  if (!shift) return res.status(404).json({ error: "Shift not found" });

  shift.rejects.push(shiftDay);
  const match = shiftDay.match(/^([A-Z]+)(\d{1,2})$/);
  const [_, key, numStr] = match;
  const num = parseInt(numStr, 10);
  if (shift.shiftDays[key]) {
    shift.shiftDays[key] = shift.shiftDays[key].filter((day) => day !== num);
  }

  await shift.save();

  res.json({ message: "Shift day rejected successfully" });
};

exports.setShiftSettings = async (req, res) => {
  const userId = req.user._id;
  const { groupId, personCount, hourCount, dayLimit } = req.body;

  const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup)
    return res.status(404).json({ error: "User group not found" });

  await shiftSettingModel.create({
    group: groupId,
    personCount,
    hourCount,
    dayLimit,
  });
  res.status(201).json({ message: "Shift settings created successfully" });
};

exports.updateShiftSettings = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { groupId, personCount, hourCount, dayLimit } = req.body;

  const userGroup = await groupModel.findOne({ _id: groupId, matron: userId });
  if (!userGroup)
    return res.status(404).json({ error: "User group not found" });

  const shiftSetting = await shiftSettingModel.findOneAndUpdate(
    { _id: id, group: groupId },
    { personCount, hourCount, dayLimit }
  );
  if (!shiftSetting)
    return res.status(404).json({ error: "Shift setting not found" });
  res.status(201).json({ message: "Shift settings updated successfully" });
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
    matron: matronId,
  });
  if (!userGroup)
    return res.status(404).json({ error: "User group not found" });

  await jobInfoModel.create({
    user: userId,
    group: groupId,
    post,
    employment,
    experience,
    hourReduction,
    promotionDuty,
    nonPromotionDuty,
  });
  res.status(201).json({ message: "Job info created successfully" });
};

exports.updateJobInfo = async (req, res) => {
  const { id } = req.params;
  const matronId = req.user._id;
  const {
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
    matron: matronId,
  });
  if (!userGroup)
    return res.status(404).json({ error: "User group not found" });

  const jobInfo = await jobInfoModel.findByIdAndUpdate(id, {
    post,
    employment,
    experience,
    hourReduction,
    promotionDuty,
    nonPromotionDuty,
  });
  if (!jobInfo) return res.status(404).json({ error: "Job info not found" });

  res.status(201).json({ message: "Job info created successfully" });
};
