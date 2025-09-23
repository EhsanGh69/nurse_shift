const shiftDays = {
  M: [1, 2, 3],
  E: [4, 5],
  N: [6, 7],
  MN: [9],
  V: [10, 15],
  OFF: [12, 14]
}

const stdShiftCount = { M: 10, E: 5, N: 7, CS: 2 }

const favCS = "MN"

function generateShiftSchedule(shiftDays, stdShiftCount, totalDays = 30) {
  const schedule = {};
  const usedDays = new Set(Object.values(shiftDays).flat());

  // مرحله ۱: ثبت شیفت‌های انتخاب‌شده
  for (const [shift, days] of Object.entries(shiftDays)) {
    for (const day of days) {
      schedule[day] = shift;
    }
  }

  // مرحله ۲: محاسبه تعداد انتخاب‌شده برای هر شیفت
  const selectedCount = { M: 0, E: 0, N: 0, CS: 0 };
  for (const [shift, days] of Object.entries(shiftDays)) {
    if (['M', 'E', 'N'].includes(shift)) {
      selectedCount[shift] += days.length;
    } else {
      selectedCount.CS += days.length;
    }
  }

  // مرحله ۳: محاسبه تعداد باقی‌مانده
  const remaining = {};
  for (const [shift, stdCount] of Object.entries(stdShiftCount)) {
    const current = selectedCount[shift] || 0;
    remaining[shift] = Math.max(stdCount - current, 0);
  }

  // مرحله ۴: پیدا کردن روزهای خالی
  const allDays = Array.from({ length: totalDays }, (_, i) => i + 1);
  const unassignedDays = allDays.filter(day => !usedDays.has(day));

  // مرحله ۵: ساخت لیست شیفت‌های باقی‌مانده
  const remainingShifts = [];
  for (const [shift, count] of Object.entries(remaining)) {
    for (let i = 0; i < count; i++) {
      remainingShifts.push(shift);
    }
  }

  // مرحله ۶: پر کردن روزهای خالی با شیفت‌های باقی‌مانده و OFF به‌صورت پراکنده
  const totalUnassigned = unassignedDays.length;
  const totalRemaining = remainingShifts.length;
  const totalOff = totalUnassigned - totalRemaining;

  const fullShiftList = [...remainingShifts];

  // پراکندگی OFFها بین شیفت‌ها
  const spacing = Math.floor(totalUnassigned / (totalOff + 1));
  let offInserted = 0;
  for (let i = spacing; offInserted < totalOff && i <= fullShiftList.length + offInserted; i += spacing + 1) {
    fullShiftList.splice(i, 0, 'OFF');
    offInserted++;
  }

  // مرحله ۷: تخصیص نهایی
  const result = { ...schedule };
  for (let i = 0; i < unassignedDays.length; i++) {
    result[unassignedDays[i]] = fullShiftList[i] || 'OFF';
  }

  return result;
}


console.log(generateShiftSchedule(shiftDays, stdShiftCount))