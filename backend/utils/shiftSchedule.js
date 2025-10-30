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

exports.generateShiftSchedule = (shiftDays, stdShiftCount, year, month, favCS="") => {
  // ✅ آماده‌سازی ساختار خروجی اولیه
  const result = {
    M: shiftDays.M ? [...shiftDays.M] : [],
    E: shiftDays.E ? [...shiftDays.E] : [],
    N: shiftDays.N ? [...shiftDays.N] : [],
    MH: shiftDays.N ? [...shiftDays.MH] : [],
    EH: shiftDays.N ? [...shiftDays.EH] : [],
    NH: shiftDays.N ? [...shiftDays.NH] : [],
    V: shiftDays.V ? [...shiftDays.V] : [],
    OFF: shiftDays.OFF ? [...shiftDays.OFF] : [],
    CS: [] // به صورت موقت
  }

  const schedule = Array(totalDays(month, year)).fill(null)

  // --- 1️⃣ پر کردن روزهای کاربر
  for (const [key, days] of Object.entries(shiftDays)) {
    days.forEach(d => {
      if (d >= 1 && d <= totalDays(month, year)) schedule[d - 1] = key
    })
  }

  // --- 2️⃣ محاسبه تعداد باقی‌مانده‌ی شیفت‌ها
  const remaining = { ...stdShiftCount }
  for (const [key, days] of Object.entries(shiftDays)) {
    if (remaining[key]) remaining[key] -= days.length
    if (remaining[key] < 0) remaining[key] = 0
  }

  // --- 3️⃣ توزیع اولیه شیفت‌ها
  const shiftTypes = Object.keys(stdShiftCount).filter(k => k !== 'OFF')
  const emptyDays = schedule.map((v, i) => (v ? null : i + 1)).filter(Boolean)

  const canPlace = (type, i) => {
    if (type === 'N' && schedule[i - 1] === 'N') return false
    return !schedule[i]
  }

  for (const type of shiftTypes) {
    let count = remaining[type]
    let i = 0
    while (count > 0 && i < emptyDays.length) {
      const day = emptyDays[i]
      const idx = day - 1
      if (canPlace(type, idx)) {
        const actualType = type === 'CS' ? favCS : type
        schedule[idx] = actualType
        result[type].push(day)
        emptyDays.splice(i, 1)
        count--
      } else i++
    }
  }

  // --- 4️⃣ پخش یکنواخت OFF بین بقیه شیفت‌ها
  const remainingOffDays = emptyDays
  const distributedOffDays = []
  if (remainingOffDays.length) {
    const gap = Math.floor(totalDays(month, year) / (remainingOffDays.length + 1))
    let pos = gap

    for (let i = 0; i < remainingOffDays.length; i++) {
      while (pos <= totalDays(month, year) && schedule[pos - 1]) pos++
      if (pos > totalDays(month, year)) pos = remainingOffDays[i]
      distributedOffDays.push(pos)
      pos += gap
    }

    for (const d of distributedOffDays) {
      if (d >= 1 && d <= totalDays(month, year) && !schedule[d - 1]) {
        schedule[d - 1] = 'OFF'
        result.OFF.push(d)
      }
    }
  }

  // --- 5️⃣ جایگزینی favCS به جای CS در خروجی نهایی
  if (result.CS.length > 0) {
    result[favCS] = (result[favCS] || []).concat(result.CS)
  }
  delete result.CS

  // --- 6️⃣ مرتب‌سازی نهایی
  for (const key of Object.keys(result)) {
    result[key] = [...new Set(result[key])].sort((a, b) => a - b)
  }

  return result
}