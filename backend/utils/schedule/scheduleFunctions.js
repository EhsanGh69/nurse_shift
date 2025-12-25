const { stripH } = require("./helpers")

const getRemainPersonCount = (dayIndex, allMonthShifts, stdPersonCount, holidayMap) => {
    const providedCount = { M: 0, E: 0, N: 0, MH: 0, EH: 0, NH: 0 }
    allMonthShifts.forEach(user => {
        const shiftDay = user.monthShifts[dayIndex]
        if (shiftDay) {
            const isHoliday = shiftDay[1].includes("H")
            if (!isHoliday && shiftDay[1].includes("M")) providedCount.M += 1
            if (isHoliday && shiftDay[1].includes("M")) providedCount.MH += 1
            if (!isHoliday && shiftDay[1].includes("E")) providedCount.E += 1
            if (isHoliday && shiftDay[1].includes("E")) providedCount.EH += 1
            if (!isHoliday && shiftDay[1].includes("N")) providedCount.N += 1
            if (isHoliday && shiftDay[1].includes("N")) providedCount.NH += 1
        }
    })
    function getRemainCount(providedDayCount, dayIndex) {
        const isHolidayMap = holidayMap[dayIndex]
        const remainCount = { M: 0, E: 0, N: 0, MH: 0, EH: 0, NH: 0 }
        const stdObj = Object.fromEntries(stdPersonCount)
        Object.entries(providedDayCount).forEach(([Pk, Pv]) => {
            Object.entries(stdObj).forEach(([Sk, Sv]) => {
                const notHolidayCount = Pk === Sk && !isHolidayMap && !Pk.includes("H")
                const isHolidayCount = Pk === Sk && isHolidayMap && Pk.includes("H")
                if (notHolidayCount || isHolidayCount) remainCount[Pk] = Pv - Sv
            })
        })
        return remainCount;
    }
    return getRemainCount(providedCount, dayIndex);
}

const getRequestedDays = (allMonthShifts=[], maxAllowed) => {
    const requestedDays = {}
    for (const user of allMonthShifts) {
        const checkUser = maxAllowed.find(userMax => userMax.user === String(user.user))
        if(!checkUser) continue;
        requestedDays[String(user.user)] = []
        user.monthShifts.forEach(shiftDay => {
            if(shiftDay) requestedDays[String(user.user)].push(shiftDay[0])
        })
    }
    return requestedDays
}

const insertNChecker = (before, after) => {
    const OFFBefore = before && before[1] === "OFF"
    const OFFAfter = after && after[1] === "OFF"
    const NCheck = before && !stripH(before[1]).includes("N")
    const CSCheck = before && stripH(before[1]).length === 1
    const beforeCheck = !before || OFFBefore || NCheck && CSCheck 
    const afterCheck = !after || OFFAfter
    return beforeCheck && afterCheck
}

const checkShiftAround = (monthShifts, day, type="") => {
    const twoDaysAgo = monthShifts[day - 2]
    const twoDaysLater = monthShifts[day + 2]
    const yesterday = monthShifts[day - 1]
    const tomorrow = monthShifts[day + 1]
    let condition = false
    const notNAround = (!twoDaysAgo || (twoDaysAgo && !stripH(twoDaysAgo[1]).includes("N"))) &&
        (!twoDaysLater || (twoDaysLater && !stripH(twoDaysLater[1]).includes("N")))
    const notCSAround = (!yesterday || (yesterday && yesterday[1] === "OFF" ||
        stripH(yesterday[1]).length === 1)) 
        && (!tomorrow || (tomorrow && tomorrow[1] === "OFF" ||
        stripH(tomorrow[1]).length === 1))
    switch (type) {
        case "N":
            condition = notNAround
            break;
        default:
            condition = type.includes("N") ? notNAround && notCSAround : notCSAround
            break;
    }
    return condition
}

module.exports = {
    getRemainPersonCount,
    getRequestedDays,
    insertNChecker,
    checkShiftAround
}