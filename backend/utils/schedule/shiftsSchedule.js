const lodash = require("lodash")

const { stripH, getIsHolidaysMap } = require("./helpers")
const { getRemainPersonCount } = require("./scheduleFunctions")
const { daysAndRequests, insertShiftController, removeShiftController } = require("./scheduleTools")

const primarySchedule = (allMonthShifts, stdAllowed, date) => {
    const { year, month } = date
    const { stdPersonCount, maxAllowed } = stdAllowed
    const { totalDays, holidayMap, requestedDays } = daysAndRequests(year, month, allMonthShifts, maxAllowed)
    
    const nullPerLoops = {}
    const getNulls = (allMonthShifts, loop) => {
        let nulls = []
        allMonthShifts.forEach(user => {
            user.monthShifts.forEach((dayShift, dayIndex) => {
                if (!dayShift) nulls.push(dayIndex + 1)
            })
        })
        nullPerLoops[loop] = nulls
    }
    let nullInfinite = true;
    let nullLoop = 0;
    do {
        for (const user of allMonthShifts) {
            const userMaxAllowed = maxAllowed.find(userMax => userMax.user === String(user.user))
            if (!userMaxAllowed) continue;
            let nextInsert = "N"
            for (let day = 0; day < totalDays; day++) {
                let remainPersonCount = getRemainPersonCount(day, allMonthShifts, stdPersonCount, holidayMap)
                const shiftDay = user.monthShifts[day]
                if (requestedDays[String(user.user)].includes(day + 1)) continue;
                if (!shiftDay) {
                    if (nextInsert === "N") {
                        const insertNResult = insertShiftController("N", user, { day, year, month },
                            {
                                remainPersonCount, monthMax: userMaxAllowed.monthMax,
                                allowedCount: userMaxAllowed.amounts
                            }, "&&")
                        if (insertNResult) {
                            nextInsert = "E"
                            continue;
                        } else nextInsert = "E"
                    }
                    if (nextInsert === "E") {
                        const insertEResult = insertShiftController("E", user, { day, year, month },
                            {
                                remainPersonCount, monthMax: userMaxAllowed.monthMax,
                                allowedCount: userMaxAllowed.amounts
                            }, "&&")
                        if (insertEResult) {
                            nextInsert = "MN"
                            continue;
                        } else nextInsert = "MN"
                    }
                    if (nextInsert === "MN") {
                        const insertMNResult = insertShiftController("MN", user, { day, year, month },
                            {
                                remainPersonCount, monthMax: userMaxAllowed.monthMax,
                                allowedCount: userMaxAllowed.amounts
                            }, "")
                        if (insertMNResult) {
                            nextInsert = "M"
                            continue;
                        } else nextInsert = "M"
                    }
                    if (nextInsert === "M") {
                        const insertMResult = insertShiftController("M", user, { day, year, month },
                            {
                                remainPersonCount, monthMax: userMaxAllowed.monthMax,
                                allowedCount: userMaxAllowed.amounts
                            }, "&&")
                        if (insertMResult) {
                            nextInsert = "N"
                            continue;
                        } else nextInsert = "N"
                    }
                }
            }
        }
        nullLoop++;
        getNulls(allMonthShifts, nullLoop);
        console.log(`${nullLoop} => `, nullPerLoops[nullLoop].length)
        if (nullLoop > 1 && nullPerLoops[nullLoop].length === nullPerLoops[nullLoop - 1].length) break;
    } while (nullInfinite);
    return allMonthShifts;
}

const finalSchedule = (userShifts, stdAllowed, date) => {
    const { requestedShifts, allMonthShifts } = userShifts
    const { stdPersonCount, maxAllowed } = stdAllowed
    const { year, month } = date
    const { totalDays, holidayMap, requestedDays } = daysAndRequests(year, month, requestedShifts, maxAllowed)

    const remainPerLoops = {}
    const getRemains = (allMonthShifts, loop) => {
        const monthSumRemains = { shortage: 0, surplus: 0 }
        for (let day = 0; day < totalDays; day++) {
            const remainCounts = getRemainPersonCount(day, allMonthShifts, stdPersonCount, holidayMap)
            Object.values(remainCounts).forEach(value => {
                if (value > 0) monthSumRemains.surplus += value
                else if (value < 0) monthSumRemains.shortage += value
            })
        }
        // remainPerLoops[loop] = monthSumRemains
        remainPerLoops[loop] = lodash.sum(Object.values(monthSumRemains))
    }

    let remainInfinite = true;
    let remainLoop = 0;
    do {
        for (let day = 0; day < totalDays; day++) {
            let nextInsert = "N"
            for (const user of allMonthShifts) {
                const userMaxAllowed = maxAllowed.find(userMax => userMax.user === String(user.user))
                if (!userMaxAllowed) continue;
                let remainPersonCount = getRemainPersonCount(day, allMonthShifts, stdPersonCount, holidayMap)
                const shiftDay = user.monthShifts[day]
                const YDay = user.monthShifts[day - 1]
                let allowedOFF = shiftDay && shiftDay[1] === 'OFF'
                if (shiftDay && YDay) allowedOFF = shiftDay[1] === 'OFF' && !stripH(YDay[1]).includes("N")
                if (requestedDays[String(user.user)].includes(day + 1)) continue;
                if (allowedOFF) {
                    if (nextInsert === "N") {
                        const insertNResult = insertShiftController("N", user, { day, year, month },
                            { remainPersonCount, monthMax: userMaxAllowed.monthMax, 
                            allowedCount: userMaxAllowed.amounts }, "||")
                        if (insertNResult) {
                            nextInsert = "ME"
                            continue;
                        } else nextInsert = "ME"
                    }
                    if (nextInsert === "ME") {
                        const insertMEResult = insertShiftController("ME", user, { day, year, month },
                            { remainPersonCount, monthMax: userMaxAllowed.monthMax, 
                            allowedCount: userMaxAllowed.amounts }, "")
                        if (insertMEResult) {
                            nextInsert = "E"
                            continue;
                        } else nextInsert = "E"
                    }
                    if (nextInsert === "E") {
                        const insertEResult = insertShiftController("E", user, { day, year, month },
                            { remainPersonCount, monthMax: userMaxAllowed.monthMax, 
                            allowedCount: userMaxAllowed.amounts }, "||")
                        if (insertEResult) {
                            nextInsert = "M"
                            continue;
                        } else nextInsert = "M"
                    }
                    if (nextInsert === "M") {
                        const insertMResult = insertShiftController("M", user, { day, year, month },
                            { remainPersonCount, monthMax: userMaxAllowed.monthMax, 
                            allowedCount: userMaxAllowed.amounts }, "||")
                        if (insertMResult) {
                            nextInsert = "N"
                            continue;
                        } else nextInsert = "N"
                    }
                }
                else {
                    let extraShift = false;
                    if (shiftDay && shiftDay !== "V") {
                        const isHoliday = getIsHolidaysMap(year, month)[day]
                        extraShift = removeShiftController(shiftDay, isHoliday, remainPersonCount)
                    }
                    if (extraShift || !shiftDay) {
                        user.monthShifts[day] = [day + 1, "OFF"]
                    }
                }
            }
        }
        remainLoop++;
        getRemains(allMonthShifts, remainLoop)
        if (remainLoop > 1 && remainPerLoops[remainLoop] === remainPerLoops[remainLoop - 1]) break;
    } while (remainInfinite);

    const finalPersonCounts = { shortage: 0, surplus: 0 }
    for (let day = 0; day < totalDays; day++) {
        const remainCounts = getRemainPersonCount(day, allMonthShifts, stdPersonCount, holidayMap)
        Object.values(remainCounts).forEach(value => {
            if (value > 0) finalPersonCounts.surplus += value
            else if (value < 0) finalPersonCounts.shortage += value
        })
    }

    // console.log(`remainPerLoops -> `, remainPerLoops)
    console.log(`finalPersonCounts -> `, finalPersonCounts)
    return {allMonthShifts, finalPersonCounts};
}

module.exports = {
    primarySchedule,
    finalSchedule
}
