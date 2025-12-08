const { daysInJalaliMonth, stripH, getIsHolidaysMap } = require("./helpers")


const checkStdCount = (stdCounts) => {
  const result = []
  for (const type in stdCounts) {
    if(!stdCounts[type][0] && !stdCounts[type][1]) result.push(0)
    else result.push(1)
  }
  return result.some(i => i)
}


exports.applyShiftsCounts = (nurseShiftDays = {}, isMatronStaff=false, year, month) => {
  const totalDays = daysInJalaliMonth(year, month)
  const schedule = Array(totalDays).fill(null)

  // Insert provided shifts
  Object.entries(nurseShiftDays).forEach(([key, days]) => {
    days.forEach(day => {
      schedule[day - 1] = [day, key]
    })
  })

  // normalize provided shifts
  schedule.forEach((item, index) => {
    if (item && (stripH(item[1]).includes("N") && !schedule[index + 1] && index + 2 <= totalDays))
      schedule[index + 1] = [index + 2, 'OFF']
    if(isMatronStaff && !item)
      schedule[index] = [index + 1, 'M']
  })

  return schedule

 /*
  if(!checkStdCount(stdShiftsCounts)) return schedule;


  // get nurse shift count
  const nurseShiftsCount = { N: 0, CS: 0, OFF: 0 }
  schedule.forEach((item, index) => {
    if (item) {
      if (stripH(item[1]) === 'N') {
        nurseShiftsCount.N += 1
      }
      if (item[1] === 'OFF') {
        const NCheck = schedule[index - 1] && !stripH(schedule[index - 1][1]).includes("N")
        const CSCheck = schedule[index - 1] && stripH(schedule[index - 1][1]).length === 1
        if (!schedule[index - 1] || NCheck && CSCheck)
          nurseShiftsCount.OFF += 1
      }
      if (item[1] !== 'OFF' && stripH(item[1]).length > 1) {
        nurseShiftsCount.CS += 1
      }
    }
  })

 
  // get remain shift count
  const remainShiftCount = { N: 0, CS: 0, OFF: 0 }
  Object.entries(nurseShiftsCount).forEach(([Nk, Nv]) => {
    Object.entries(stdShiftsCounts).forEach(([Sk, Sv]) => {
      if (Nk === Sk) {
        if (Nv < Sv[0]) remainShiftCount[Nk] = Nv - Sv[0]
        if (Nv > Sv[1]) remainShiftCount[Nk] = Sv[1] - Nv
      }
    })
  })

  schedule.forEach((item, index) => {
    if (!item && (remainShiftCount.N < 0 || remainShiftCount.OFF < 0 || remainShiftCount.CS < 0)) {
      const isHoliday = !!getIsHolidaysMap(year, month)[index]
      if (remainShiftCount.N < 0) {
        const NCheck = schedule[index - 1] && !stripH(schedule[index - 1][1]).includes("N")
        const CSCheck = schedule[index - 1] && stripH(schedule[index - 1][1]).length === 1
        if (!schedule[index + 1] && !schedule[index - 1] || NCheck && CSCheck) {
          schedule[index] = isHoliday ? [index + 1, 'NH'] : [index + 1, 'N']
          if(index + 2 <= totalDays) schedule[index + 1] = [index + 2, 'OFF']
          remainShiftCount.N += 1
        }
      }
      else if (!remainShiftCount.N && remainShiftCount.OFF < 0) {
        if (index !== 0) {
          if (!schedule[index - 1] || schedule[index - 1] && schedule[index - 1][1] !== 'OFF') {
            schedule[index] = [index + 1, 'OFF']
            remainShiftCount.OFF += 1
          }
        }
      }
      else if (!remainShiftCount.N && !remainShiftCount.OFF && remainShiftCount.CS < 0) {
        const afterCS = !schedule[index + 1]
        const beforeCS = !schedule[index - 1] || schedule[index - 1] === "OFF"
        if (beforeCS && afterCS) {
          schedule[index] = isHoliday ? [index + 1, `${favCS}H`] : [index + 1, favCS]
          if(index + 2 <= totalDays) schedule[index + 1] = [index + 2, 'OFF']
          remainShiftCount.CS += 1
        }
      }
    }

    else if (item && (remainShiftCount.N > 0 || remainShiftCount.OFF > 0 || remainShiftCount.CS > 0)) {
      if (remainShiftCount.N > 0 && item[1] === "N") {
        schedule[index] = null
        schedule[index + 1] = null
        remainShiftCount.N -= 1
      }
      else if (!remainShiftCount.N && remainShiftCount.OFF > 0 && item[1] === "OFF") {
        const NCheck = schedule[index - 1] && !stripH(schedule[index - 1][1]).includes("N")
        const CSCheck = schedule[index - 1] && stripH(schedule[index - 1][1]).length === 1
        if (!schedule[index - 1] || NCheck && CSCheck) {
          schedule[index] = null
          remainShiftCount.OFF -= 1
        }
      }
      else if (!remainShiftCount.N && !remainShiftCount.OFF && remainShiftCount.CS > 0 && stripH(item[1]).length > 1) {
        schedule[index] = null
        schedule[index + 1] = null
        remainShiftCount.CS -= 1
      }
    }
  })

  return schedule;
  */
}

exports.getUserShiftCount = (userId, subs = []) => {
  if (!subs.length) return false
  let userSub = null
  subs.forEach(sub => {
    const foundUser = sub.members.some(member => member.user.toString() === userId)
    if (foundUser) userSub = sub
  })
  if (!userSub) return false
  return userSub.shiftCount
}