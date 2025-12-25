const { orderBy } = require("lodash")
const { daysInJalaliMonth, stripH } = require("./helpers")


const scheduleProvider = (nurseShiftDays = {}, isMatronStaff=false, year, month) => {
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
}

exports.requestedMonthShifts = (allRequestedShifts=[], matronStaff=[], year, month) => {
  const allMonthShifts = []
  allRequestedShifts.forEach(shift => {
      const isMatronStaff = matronStaff.includes(String(shift.user._id))
      const monthShifts = scheduleProvider(shift.shiftDays, isMatronStaff, year, month)
      allMonthShifts.push({ user: shift.user._id, monthShifts })
  })
  return allMonthShifts
}

exports.scheduleSorter = (allMonthShifts=[], allJobInfos=[]) => {
  const allExperiences = orderBy(
    allJobInfos.map(info => ({ user: String(info.user), experience: info.experience })),
    ['experience'], ['asc']
  )

  const sortedByExperience = []
  allExperiences.forEach(exp => {
    allMonthShifts.forEach(user => {
        if(String(user.user) === exp.user) sortedByExperience.push(user)
    })
  })

  return sortedByExperience
}

exports.convertToArray = (allMonthShifts=[]) => {
  const convertedSchedule = []
  allMonthShifts.forEach(user => {
    const convertedUser = {user: user.user, monthShifts: []}
    user.monthShifts.forEach(shistDay => {
      if(shistDay) convertedUser.monthShifts.push(Object.values(shistDay))
      else convertedUser.monthShifts.push(shistDay)
    })
    convertedSchedule.push(convertedUser)
  })
  return convertedSchedule
}
