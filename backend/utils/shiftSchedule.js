const checkLeapYear = (year=1404) => {
    const diffYear = year - 1403
    if(diffYear % 4 === 0) return true
    return false
}

const totalDays = (month, year) => {
    if(month >= 1 && month <= 6) return 31
    else if (month >= 7 && month <= 11) return 30
    else if(month === 12){
      if(checkLeapYear(year)) return 30
      else return 29
    }
}

exports.generateShiftSchedule = (shiftDaysInput, stdShiftCount, year, month, favCS="") => {
  const schedule = {};
  const usedDays = new Set(Object.values(shiftDaysInput).flat());

  // مرحله ۱: ثبت شیفت‌های انتخاب‌شده
  for (const [shift, days] of Object.entries(shiftDaysInput)) {
    for (const day of days) {
      schedule[day] = shift;
    }
  }

  // مرحله ۲: محاسبه تعداد انتخاب‌شده برای هر شیفت
  const selectedCount = { M: 0, E: 0, N: 0, CS: 0 };
  const isCombinedShift = (shift) => {
    const base = ['M', 'E', 'N'];
    return (
      shift !== 'OFF' &&
      shift.split('').every((c) => base.includes(c)) &&
      shift.length >= 2
    );
  };

  for (const [shift, days] of Object.entries(shiftDaysInput)) {
    if (['M', 'E', 'N'].includes(shift)) {
      selectedCount[shift] += days.length;
    } else if (isCombinedShift(shift)) {
      selectedCount.CS += days.length;
    }
  }
 
  // مرحله ۳: محاسبه باقی‌مانده
  const remaining = {};
  for (const [shift, stdCount] of Object.entries(stdShiftCount)) {
    const current = selectedCount[shift] || 0;
    remaining[shift] = Math.max(stdCount - current, 0);
  }

  // مرحله ۴: روزهای خالی
  const allDays = Array.from({ length: totalDays(month, year) }, (_, i) => i + 1);
  const unassignedDays = allDays.filter((day) => !usedDays.has(day));

  // مرحله ۵: ساخت لیست OFF و CS
  const totalUnassigned = unassignedDays.length;
  const totalCS = remaining.CS;

  const offDays = [];
  const csDays = [];

  const spacing = Math.floor(totalUnassigned / (totalCS + 1));
  let csInserted = 0;
  for (let i = spacing; csInserted < totalCS && i < totalUnassigned; i += spacing + 1) {
    csDays.push(unassignedDays[i]);
    csInserted++;
  }

  for (const day of unassignedDays) {
    if (!csDays.includes(day)) offDays.push(day);
  }

  // مرحله ۶: ساخت لیست نهایی شیفت‌ها
  const remainingShifts = [];
  for (const [shift, count] of Object.entries(remaining)) {
    if (shift !== 'CS') {
      for (let i = 0; i < count; i++) {
        remainingShifts.push(shift);
      }
    }
  }

  // مرحله ۷: تخصیص نهایی
  const result = { ...schedule };
  for (const day of csDays) {
    // result[day] = 'CS';
    result[day] = favCS;
  }
  for (const day of offDays) {
    result[day] = 'OFF';
  }

  const remainingDays = allDays.filter((d) => !Object.keys(result).includes(d.toString()));
  for (let i = 0; i < remainingDays.length; i++) {
    result[remainingDays[i]] = remainingShifts[i] || 'OFF';
  }

  // مرحله ۸: تبدیل به shiftDays
  const finalShiftDays = {};
  for (const [dayStr, shift] of Object.entries(result)) {
    const day = parseInt(dayStr);
    if (!finalShiftDays[shift]) finalShiftDays[shift] = [];
    finalShiftDays[shift].push(day);
  }

  return finalShiftDays;
}

exports.getUserShiftCount = (userId, subs=[]) => {
  if(!subs.length) return false
  let userSub = null
  subs.forEach(sub => {
    const foundUser = sub.members.some(member => member.user.toString() === userId)
    if(foundUser) userSub = sub
  })
  if(!userSub) return false
  return userSub.shiftCount
}