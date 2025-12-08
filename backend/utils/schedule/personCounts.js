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

exports.applyPersonCounts = (allMonthShifts, stdPersonCount, year, month) => {
    const totalDays = daysInJalaliMonth(year, month)
    const holidayMap = getIsHolidaysMap(year, month)

    const insertNChecker = (before) => {
        const NCheck = before && !stripH(before[1]).includes("N")
        const beforeCheck = !before || NCheck
        // const OFFCheck = after && after[1] === 'OFF'
        // const afterCheck = !after || OFFCheck
        return beforeCheck
    }

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
        for (let day = 0; day < totalDays; day++) {
            for(const user of allMonthShifts) {
                let remainPersonCount = getRemainPersonCount(day, allMonthShifts, stdPersonCount, holidayMap)
                let remainAllowedCount = getRemainAllowedCount(user.user, user.monthShifts);
                if(remainAllowedCount === false) continue;
                const userMonthMax = maxAllowed.find(userMax => userMax.user === String(user.user))?.monthMax
                const userShiftsCount = getMonthCount(user.monthShifts)
                const shiftDay = user.monthShifts[day]
                const isHoliday = getIsHolidaysMap(year, month)[day]
                const YDay = user.monthShifts[day - 1]
                // const TDay = user.monthShifts[day + 1]
                const userFavCS = maxAllowed.find(userMax => userMax.user === String(user.user)).favCS

                if (!shiftDay && userShiftsCount <= userMonthMax) {
                    if(remainAllowedCount.M <= 0 || remainPersonCount.M < 0 || remainPersonCount.MH < 0) {
                        user.monthShifts[day] = isHoliday ? [day + 1, "MH"] : [day + 1, "M"]
                        continue;
                    }
                    if(remainAllowedCount.E <= 0 || remainPersonCount.E < 0 || remainPersonCount.EH < 0) {
                        user.monthShifts[day] = isHoliday ? [day + 1, "EH"] : [day + 1, "E"]
                        continue;
                    }
                    if(remainAllowedCount.N <= 0 || remainPersonCount.N < 0 || remainPersonCount.NH < 0) {
                        if (insertNChecker(YDay)) {
                            user.monthShifts[day] = isHoliday ? [day + 1, "NH"] : [day + 1, "N"]
                            user.monthShifts[day + 1] = [day + 2, 'OFF']
                            continue;
                        }
                    }
                    if(remainAllowedCount.CS <= 0) {
                        const includeME = userFavCS.includes("M") && userFavCS.includes("E")
                        const includeMN = userFavCS.includes("M") && userFavCS.includes("N")
                        const includeEN = userFavCS.includes("E") && userFavCS.includes("N")

                        const MECondition = includeME && (remainPersonCount.M < 0 || remainPersonCount.MH < 0) 
                            && (remainPersonCount.E < 0 || remainPersonCount.EH < 0)
                        const MNCondition = includeMN && (remainPersonCount.M < 0 || remainPersonCount.MH < 0) 
                            && (remainPersonCount.N < 0 || remainPersonCount.NH < 0)
                        const ENCondition = includeEN && (remainPersonCount.E < 0 || remainPersonCount.EH < 0) 
                            && (remainPersonCount.N < 0 || remainPersonCount.NH < 0)
                        if(MECondition || MNCondition || ENCondition) {
                            if(insertNChecker(YDay)){
                                user.monthShifts[day] = isHoliday 
                                ? [day + 1, `${userFavCS}H`] : [day + 1, `${userFavCS}`]
                                if(includeMN || includeEN) user.monthShifts[day + 1] = [day + 2, 'OFF']
                            }
                        }
                    }
                }
                else if(shiftDay) {
                    let extraShift = false;
                    const stripShift = stripH(shiftDay[1])
                    switch (stripShift) {
                        case 'M':
                            extraShift = remainAllowedCount.M > 0 || remainPersonCount.M > 0 || 
                                remainPersonCount.MH > 0
                            break;
                        case 'E':
                            extraShift = remainAllowedCount.E > 0 || remainPersonCount.E > 0 || 
                                remainPersonCount.EH > 0
                            break;
                        case 'N':
                            extraShift = remainAllowedCount.N > 0 || remainPersonCount.N > 0 ||
                                remainPersonCount.NH > 0
                            break;
                        case 'OFF':
                            break;
                        default:
                            extraShift = remainAllowedCount.CS > 0
                            break;
                    }
                    if(extraShift){
                        user.monthShifts[day] = [day + 1, "OFF"]
                    }
                }
            }
        }
        nullLoop++;
        getNulls(allMonthShifts, nullLoop);
        if(nullLoop > 1 && nullPerLoops[nullLoop].length === nullPerLoops[nullLoop - 1].length) break;
    } while (nullInfinite);


    const remainPerLoops = {}

    const getRemains = (allMonthShifts, loop) => {
        const monthSumRemains = {}
        for (let day = 0; day < totalDays; day++) {
            const remainCounts = getRemainPersonCount(day, allMonthShifts, stdPersonCount, holidayMap)
            monthSumRemains[day + 1]  = lodash.sum(Object.values(remainCounts))
        }
        remainPerLoops[loop] = lodash.sum(Object.values(monthSumRemains))
    }

    let remainInfinite = true;
    let remainLoop = 0;

    do {
        for(const user of allMonthShifts) {
            for (let day = 0; day < totalDays; day++) {
                const checkUser = maxAllowed.find(userMax => userMax.user === String(user.user))
                if(!checkUser) continue;
                let remainPersonCount = getRemainPersonCount(day, allMonthShifts, stdPersonCount, holidayMap)
                
                const shiftDay = user.monthShifts[day]
                const YDay = user.monthShifts[day - 1]
                const TDay = user.monthShifts[day + 1]
                const isHoliday = getIsHolidaysMap(year, month)[day]
                const allowedOFF = shiftDay[1] === 'OFF' && day === 0 ||
                    shiftDay[1] === 'OFF' && YDay && !stripH(YDay[1]).includes("N")
                const userShiftsCount = getMonthCount(user.monthShifts)
                    
                if(allowedOFF && userShiftsCount <= checkUser.monthMax){
                    if(remainPersonCount.M < 0 || remainPersonCount.MH < 0){
                        user.monthShifts[day] = isHoliday ? [day + 1, "MH"] : [day + 1, "M"]
                    }
                    if(remainPersonCount.E < 0 || remainPersonCount.EH < 0){
                        user.monthShifts[day] = isHoliday ? [day + 1, "EH"] : [day + 1, "E"]
                    }
                    if(remainPersonCount.N < 0 || remainPersonCount.NH < 0 && TDay[1] === "OFF"){
                        user.monthShifts[day] = isHoliday ? [day + 1, "NH"] : [day + 1, "N"]
                    }
                }
                else {
                    let extraShift = false;
                    const stripShift = stripH(shiftDay[1])
                    switch (stripShift) {
                        case 'M':
                            extraShift = remainPersonCount.M > 0 || remainPersonCount.MH > 0
                            break;
                        case 'E':
                            extraShift = remainPersonCount.E > 0 || remainPersonCount.EH > 0
                            break;
                        case 'N':
                            extraShift = remainPersonCount.N > 0 || remainPersonCount.NH > 0
                            break;
                    }
                    if(extraShift){
                        user.monthShifts[day] = [day + 1, "OFF"]
                    }
                }
            }
        }
        remainLoop++;
        getRemains(allMonthShifts, remainLoop);
        if(remainLoop > 1 && remainPerLoops[remainLoop] === remainPerLoops[remainLoop - 1]) break;
    } while (remainInfinite);

    // const finalPersonCounts = {}
    // for (let day = 0; day < totalDays; day++) {
    //     const remainCounts = getRemainPersonCount(day, allMonthShifts, stdPersonCount, holidayMap)
    //     finalPersonCounts[day + 1]  = remainCounts
    // }
    
    console.log(`nullPerLoops -> `, nullPerLoops)
    console.log(`remainPerLoops -> `, remainPerLoops)
    
    return allMonthShifts
}