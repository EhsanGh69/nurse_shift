const lodash = require("lodash")

const { daysInJalaliMonth, stripH, getIsHolidaysMap } = require("./helpers")
const { getRemainAllowedCount, maxAllowed, getMonthCount } = require("./maxAllowed")

function getRemainPersonCount(dayIndex, allMonthShifts, stdPersonCount, holidayMap) {
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

const getRequestedDays = (allMonthShifts=[]) => {
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
    let condition = false
    const notNAround = (!monthShifts[day - 2] || 
        (monthShifts[day - 2] && !stripH(monthShifts[day - 2][1]).includes("N"))) &&
        (!monthShifts[day + 2] ||
          (monthShifts[day + 2] && !stripH(monthShifts[day + 2][1]).includes("N")))
    const notCSAround = (!monthShifts[day - 1] || (monthShifts[day - 1] &&
         monthShifts[day - 1] === "OFF" || stripH(monthShifts[day - 1][1]).length === 1)) && 
        (!monthShifts[day + 1] || (monthShifts[day + 1] &&
            monthShifts[day + 1] === "OFF" || stripH(monthShifts[day + 1][1]).length === 1))
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

const primarySchedule = (allMonthShifts, stdPersonCount, year, month) => {
    const totalDays = daysInJalaliMonth(year, month)
    const holidayMap = getIsHolidaysMap(year, month)
    // const requestedDays = getRequestedDays(allMonthShifts)

    const nullPerLoops = {}
    const getNulls = (allMonthShifts, loop) => {
        let nulls = []
        allMonthShifts.forEach(user => {
            user.monthShifts.forEach((dayShift, dayIndex) => {
                if(!dayShift) nulls.push(dayIndex + 1)
            })
        })
        nullPerLoops[loop] = nulls
    }

    let nullInfinite = true;
    let nullLoop = 0;
    do {
        for(const user of allMonthShifts) {
            // const checkUser = maxAllowed.find(userMax => userMax.user === String(user.user))
            // if(!checkUser) continue;
            let nextInsert = "N"
            for (let day = 0; day < totalDays; day++) {
                let remainPersonCount = getRemainPersonCount(day, allMonthShifts, stdPersonCount, holidayMap)
                let remainAllowedCount = getRemainAllowedCount(user.user, user.monthShifts);
                const userMaxAllowed = maxAllowed.find(userMax => userMax.user === String(user.user))
                const userShiftsCount = getMonthCount(user.monthShifts)
                const shiftDay = user.monthShifts[day]
                const isHoliday = getIsHolidaysMap(year, month)[day]
                const YDay = user.monthShifts[day - 1]
                const TDay = user.monthShifts[day + 1]
                // if(requestedDays[String(user.user)].includes(day + 1)) continue;
                if (!shiftDay) {
                    const shortageN = (!isHoliday && remainPersonCount.N < 0) 
                                      || (isHoliday && remainPersonCount.NH < 0)
                    const shortageE = (!isHoliday && remainPersonCount.E < 0) 
                                      || (isHoliday && remainPersonCount.EH < 0)
                    const shortageM = (!isHoliday && remainPersonCount.M < 0) 
                                      || (isHoliday && remainPersonCount.MH < 0)
                    if(nextInsert === "N") {
                        const checkCount = shortageN && userShiftsCount <= userMaxAllowed.monthMax &&
                         remainAllowedCount.N < 0
                        const checkShift = insertNChecker(YDay, TDay) && 
                        checkShiftAround(user.monthShifts, day, "N")
                        if (checkCount && checkShift) {
                            user.monthShifts[day] = isHoliday ? [day + 1, "NH"] : [day + 1, "N"]
                            user.monthShifts[day + 1] = [day + 2, 'OFF']
                            nextInsert = "E"
                            continue;
                        }else nextInsert = "E"
                    }
                    if(nextInsert === "E") {
                        const checkCount = shortageE && userShiftsCount <= userMaxAllowed.monthMax &&
                         remainAllowedCount.E <= 0
                        const checkBefore = !YDay || YDay && !stripH(YDay[1]).includes("N")
                        if(checkCount && checkBefore){
                            user.monthShifts[day] = isHoliday ? [day + 1, "EH"] : [day + 1, "E"]
                            nextInsert = "MN"
                            continue;
                        }else nextInsert = "MN"
                    }
                    if(nextInsert === "MN") {
                        const checkCount = (shortageM && shortageN) && 
                        userShiftsCount <= userMaxAllowed.monthMax && remainAllowedCount.CS < 0
                        const checkShift = insertNChecker(YDay) && 
                        checkShiftAround(user.monthShifts, day, "MN")
                        if(checkCount && checkShift){
                            user.monthShifts[day] = isHoliday ? [day + 1, "MNH"] : [day + 1, "MN"]
                            user.monthShifts[day + 1] = [day + 2, 'OFF']
                            nextInsert = "M"
                            continue;
                        } else nextInsert = "M"
                    }
                    if(nextInsert === "M") {
                        const checkCount = shortageM && userShiftsCount <= userMaxAllowed.monthMax &&
                         remainAllowedCount.M <= 0  
                        const checkBefore = !YDay || YDay && !stripH(YDay[1]).includes("N")
                        if(checkCount && checkBefore){
                            user.monthShifts[day] = isHoliday ? [day + 1, "MH"] : [day + 1, "M"]
                            nextInsert = "N"
                            continue;
                        }else nextInsert = "N"
                    }
                }
            }
        }
        nullLoop++;
        getNulls(allMonthShifts, nullLoop);
        console.log(`${nullLoop} => `, nullPerLoops[nullLoop].length)
        if(nullLoop > 1 && nullPerLoops[nullLoop].length === nullPerLoops[nullLoop - 1].length) break;
    } while (nullInfinite);

    // console.log(`nullPerLoops -> `, nullPerLoops)
    return allMonthShifts;
}

const finalSchedule = (requestedShifts, allMonthShifts, stdPersonCount, year, month) => {
    const totalDays = daysInJalaliMonth(year, month)
    const holidayMap = getIsHolidaysMap(year, month)
    // const requestedDays = getRequestedDays(requestedShifts)

    const remainPerLoops = {}
    const getRemains = (allMonthShifts, loop) => {
        const monthSumRemains = {shortage: 0, surplus: 0}
        for (let day = 0; day < totalDays; day++) {
            const remainCounts = getRemainPersonCount(day, allMonthShifts, stdPersonCount, holidayMap)
            Object.values(remainCounts).forEach(value => {
                if(value > 0) monthSumRemains.surplus += value
                else if(value < 0) monthSumRemains.shortage += value
            })
        }
        // remainPerLoops[loop] = monthSumRemains
        remainPerLoops[loop] = lodash.sum(Object.values(monthSumRemains))
    }

    let remainInfinite = true;
    let remainLoop = 0;
    do {
        for(const user of allMonthShifts) {
            const checkUser = maxAllowed.find(userMax => userMax.user === String(user.user))
            // if(!checkUser) continue;
            let nextInsert = "N"
            for (let day = 0; day < totalDays; day++) {
                let remainPersonCount = getRemainPersonCount(day, allMonthShifts, stdPersonCount, holidayMap)
                let remainAllowedCount = getRemainAllowedCount(user.user, user.monthShifts);
                const userShiftsCount = getMonthCount(user.monthShifts)

                const shiftDay = user.monthShifts[day]
                const YDay = user.monthShifts[day - 1]
                const TDay = user.monthShifts[day + 1]
                const isHoliday = getIsHolidaysMap(year, month)[day]
                let allowedOFF = false
                if(shiftDay && YDay) allowedOFF = shiftDay[1] === 'OFF' && !stripH(YDay[1]).includes("N")
                else if(shiftDay && !YDay) allowedOFF = shiftDay[1] === 'OFF'
                // if(requestedDays[String(user.user)].includes(day + 1)) continue;
                if(allowedOFF){
                    const shortageN = (!isHoliday && remainPersonCount.N < 0) 
                                      || (isHoliday && remainPersonCount.NH < 0)
                    const shortageE = (!isHoliday && remainPersonCount.E < 0) 
                                      || (isHoliday && remainPersonCount.EH < 0)
                    const shortageM = (!isHoliday && remainPersonCount.M < 0) 
                                      || (isHoliday && remainPersonCount.MH < 0)
                            
                    if(nextInsert === "N"){
                        const checkCount = shortageN || userShiftsCount <= checkUser.monthMax &&
                         remainAllowedCount.N < 0 
                        const checkShift = insertNChecker(YDay, TDay) && 
                        checkShiftAround(user.monthShifts, day, "N")
                        if (checkCount && checkShift) {
                            user.monthShifts[day] = isHoliday ? [day + 1, "NH"] : [day + 1, "N"]
                            if(TDay) user.monthShifts[day + 1] = [day + 2, 'OFF']
                            nextInsert = "ME"
                            continue;
                        }else nextInsert = "ME"
                    }
                    if(nextInsert === "ME") {
                        const checkCount = (shortageM && shortageE) && remainAllowedCount.CS < 0 &&
                        userShiftsCount <= checkUser.monthMax
                        const checkShift = checkShiftAround(user.monthShifts, day, "ME")
                        if(checkCount && checkShift){
                            user.monthShifts[day] = isHoliday ? [day + 1, "MEH"] : [day + 1, "ME"]
                            nextInsert = "E"
                            continue;
                        }else nextInsert = "E"
                    }
                    if(nextInsert === "E"){
                        const checkCount = shortageE || userShiftsCount <= checkUser.monthMax &&
                         remainAllowedCount.E < 0 
                        const checkBefore = !YDay || YDay && !stripH(YDay[1]).includes("N")
                        if(checkCount && checkBefore){
                            user.monthShifts[day] = isHoliday ? [day + 1, "EH"] : [day + 1, "E"]
                            nextInsert = "M"
                            continue;
                        }else nextInsert = "M"
                    }
                    if(nextInsert === "M"){
                        const checkCount = shortageM || userShiftsCount <= checkUser.monthMax &&
                         remainAllowedCount.M < 0  
                        const checkBefore = !YDay || YDay && !stripH(YDay[1]).includes("N")
                        if(checkCount && checkBefore) {
                            user.monthShifts[day] = isHoliday ? [day + 1, "MH"] : [day + 1, "M"]
                            nextInsert = "N"
                            continue;
                        }else nextInsert = "N"
                    }   
                }
                else {
                    let extraShift = false;
                    if(shiftDay && shiftDay !== "V"){
                        const stripShift = stripH(shiftDay[1])
                        const surplusN = (!isHoliday && remainPersonCount.N > 0) 
                                      || (isHoliday && remainPersonCount.NH > 0)
                        const surplusE = (!isHoliday && remainPersonCount.E > 0) 
                                        || (isHoliday && remainPersonCount.EH > 0)
                        const surplusM = (!isHoliday && remainPersonCount.M > 0) 
                                        || (isHoliday && remainPersonCount.MH > 0)
                        switch (stripShift) {
                            case 'M':
                                extraShift = surplusM
                                break;
                            case 'E':
                                extraShift = surplusE
                                break;
                            case 'N':
                                extraShift = surplusN
                                break;
                            case 'MN':
                                extraShift = surplusN && surplusM
                                break;
                            case 'ME':
                                extraShift = surplusM && surplusE
                                break;
                        }
                    }
                    if((extraShift || !shiftDay)){
                        user.monthShifts[day] = [day + 1, "OFF"]
                    }
                }
            }
        }
        remainLoop++;
        getRemains(allMonthShifts, remainLoop)
        if(remainLoop > 1 && remainPerLoops[remainLoop] === remainPerLoops[remainLoop - 1]) break;
    } while (remainInfinite);

    const finalPersonCounts = {shortage: 0, surplus: 0}
    for (let day = 0; day < totalDays; day++) {
        const remainCounts = getRemainPersonCount(day, allMonthShifts, stdPersonCount, holidayMap)
        Object.values(remainCounts).forEach(value => {
            if(value > 0) finalPersonCounts.surplus += value
            else if(value < 0) finalPersonCounts.shortage += value
        })
    }

    // console.log(`remainPerLoops -> `, remainPerLoops)
    console.log(`finalPersonCounts -> `, finalPersonCounts)
    
    return allMonthShifts;
}

module.exports = {
    primarySchedule,
    finalSchedule
}