const { uniq, orderBy, isEmpty } = require("lodash")
const { stripH, daysInJalaliMonth } = require("./helpers")

const getShiftDaySchedule = (monthSchedule, day) => {
    const shiftDaySchedule = {}
    monthSchedule.forEach(sch => {
        sch.monthShifts.forEach(dayShift => {
            if(dayShift !== null && dayShift[0] === Number(day)){
                const shiftType = dayShift[1]
                if(shiftDaySchedule[shiftType]) shiftDaySchedule[shiftType].push(String(sch.user))
                else shiftDaySchedule[shiftType] = [String(sch.user)]
            }
        })
    })
    return shiftDaySchedule
}

exports.checkShiftManagers = (monthSchedule, jobInfos, year, month) => {
    const totalDays = daysInJalaliMonth(year, month)
    const allShiftManagers = orderBy(jobInfos.filter(item => item.shiftManager), ['experience'], ['asc']) 

    const shiftMonthSchedule = {}
    for (let day = 1; day <= totalDays; day++) {
        shiftMonthSchedule[day] = getShiftDaySchedule(monthSchedule, day)
    }

    const checkResult = {}
    Object.entries(shiftMonthSchedule).forEach(([day, shifts]) => {
        Object.entries(shifts).forEach(([shift, nurses]) => {
            allShiftManagers.forEach(manager => {
                if(stripH(shift).includes("E") && !nurses.includes(String(manager.user))) {
                    if(checkResult[day]) checkResult[day].push("E")
                    else checkResult[day] = ["E"]
                    checkResult[day] = uniq(checkResult[day])
                }
                if(stripH(shift).includes("N") && !nurses.includes(String(manager.user))) {
                    if(checkResult[day]) checkResult[day].push("N")
                    else checkResult[day] = ["N"]
                    checkResult[day] = uniq(checkResult[day])
                }
            })
        })
    })

    monthSchedule.forEach(sch => {
        allShiftManagers.forEach(manager => {
            if(sch.user === manager.user){
                sch.monthShifts.forEach((dayShift, dayIdx) => {
                    for (const day in checkResult) {
                        const beforeNull = !sch.monthShifts[dayIdx - 1]
                        const afterNull = !sch.monthShifts[dayIdx + 1]
                        const notBeforeN = !stripH(sch.monthShifts[dayIdx - 1]).includes("N")
                        const notBeforeCS = stripH(sch.monthShifts[dayIdx - 1]).length === 1
                        const checkOFF = stripH(sch.monthShifts[dayIdx + 1]) === "OFF"
                        if(notBeforeN || notBeforeCS || beforeNull){
                            const dayShiftExist = dayShift && dayShift[0] === day && dayShift[1] === "OFF"
                            const dayShiftNull = !dayShift && dayIdx + 1 === day
                            if (dayShiftExist || dayShiftNull) {
                                if(checkResult[day] === "E") sch.monthShifts[dayIdx] = [day, "E"]
                                if((checkOFF || afterNull) && checkResult[day] === "N") sch.monthShifts[dayIdx] = [day, "N"]
                            }
                        }
                    }
                })
            }
        })
    })

    return monthSchedule
}

exports.checkDayShiftManagers = (daySchedule, jobInfos) => {
    const allShiftManagers = orderBy(jobInfos.filter(item => item.shiftManager), ['experience'], ['asc'])
    const managerIds = allShiftManagers.map(item => String(item.user))

    const checkResult = []
    if(!isEmpty(daySchedule)) {
        Object.entries(daySchedule).forEach(([shift, nurses]) => {
            if(stripH(shift).includes("E")){
                nurses.forEach(nurse => {
                    if(!managerIds.includes(String(nurse._id))) checkResult.push("E")
                })
            }
            if(stripH(shift).includes("N")){
                nurses.forEach(nurse => {
                    if(!managerIds.includes(String(nurse._id))) checkResult.push("N")
                })
            }
        })
    }
    return uniq(checkResult)
}