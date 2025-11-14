const { daysInJalaliMonth, stripH, getIsHolidaysMap } = require("./helpers")

exports.applyPersonCounts = (allMonthShifts, stdPersonCount, year, month) => {
    const totalDays = daysInJalaliMonth(year, month)
    // get provided person count
    const providedPersonCount = {}
    for (let day = 1; day <= totalDays; day++) { 
        providedPersonCount[day] = { M: 0, E: 0, N: 0, MH: 0, EH: 0, NH: 0 } 
    }

    allMonthShifts.forEach(sch => {
        sch.monthShifts.forEach(item => {
            if (!!item) {
                const isHoliday = item[1].includes("H")
                if (!isHoliday && item[1].includes("M")) providedPersonCount[item[0]].M += 1
                if (isHoliday && item[1].includes("M")) providedPersonCount[item[0]].MH += 1
                if (!isHoliday && item[1].includes("E")) providedPersonCount[item[0]].E += 1
                if (isHoliday && item[1].includes("E")) providedPersonCount[item[0]].EH += 1
                if (!isHoliday && item[1].includes("N")) providedPersonCount[item[0]].N += 1
                if (isHoliday && item[1].includes("NH")) providedPersonCount[item[0]].NH += 1
            }
        })
    })

    function getRemainPersonCount(providedCount) {
        const remainCount = { M: 0, E: 0, N: 0, MH: 0, EH: 0, NH: 0 }
        Object.entries(providedCount).forEach(([Pk, Pv]) => {
            Object.entries(stdPersonCount).forEach(([Sk, Sv]) => {
                if (Pk === Sk) {
                    if (Pv < Sv) remainCount[Pk] = Pv - Sv
                    if (Pv > Sv) remainCount[Pk] = Sv - Pv
                }
            })
        })
        return remainCount;
    }


    // get remain person count
    const remainPersonCount = {}
    for (const day in providedPersonCount) {
        remainPersonCount[day] = getRemainPersonCount(providedPersonCount[day])
    }

    const insertNChecker = (before, after) => {
        const NCheck = before && !stripH(before[1]).includes("N")
        const CSCheck = before && stripH(before[1]).length === 1
        const beforeCheck = !before || NCheck && CSCheck
        const OFFCheck = after && after === 'OFF'
        const ECheck = after && after === 'N'
        const afterCheck = !before || OFFCheck || ECheck
        return beforeCheck && afterCheck
    }


    allMonthShifts.forEach((sch, schIdx) => {
        sch.monthShifts.forEach((item, itemIdx) => {
            const isHoliday = !!getIsHolidaysMap(year, month)[itemIdx]
            if (!item && !isHoliday) {
                if (remainPersonCount[itemIdx + 1].M < 0) {
                    allMonthShifts[schIdx].monthShifts[itemIdx] = [itemIdx + 1, 'M']
                    remainPersonCount[itemIdx + 1].M += 1
                }
                else if (!remainPersonCount[itemIdx + 1].M && remainPersonCount[itemIdx + 1].E < 0) {
                    allMonthShifts[schIdx].monthShifts[itemIdx] = [itemIdx + 1, 'E']
                    remainPersonCount[itemIdx + 1].E += 1
                }
                else if (!remainPersonCount[itemIdx + 1].M && !remainPersonCount[itemIdx + 1].E
                    && remainPersonCount[itemIdx + 1].N < 0) {
                    const beforeN = allMonthShifts[schIdx].monthShifts[itemIdx - 1]
                    const afterN = allMonthShifts[schIdx].monthShifts[itemIdx + 1]
                    if (insertNChecker(beforeN, afterN)) {
                        allMonthShifts[schIdx].monthShifts[itemIdx] = [itemIdx + 1, 'N']
                        if (!afterN) allMonthShifts[schIdx].monthShifts[itemIdx + 1] = [itemIdx + 2, 'OFF']
                        remainPersonCount[itemIdx + 1].N += 1
                    }
                }
            }
            else if (!item && isHoliday) {
                if (remainPersonCount[itemIdx + 1].MH < 0) {
                    allMonthShifts[schIdx].monthShifts[itemIdx] = [itemIdx + 1, 'MH']
                    remainPersonCount[itemIdx + 1].MH += 1
                }
                else if (!remainPersonCount[itemIdx + 1].MH && remainPersonCount[itemIdx + 1].EH < 0) {
                    allMonthShifts[schIdx].monthShifts[itemIdx] = [itemIdx + 1, 'EH']
                    remainPersonCount[itemIdx + 1].EH += 1
                }
                else if (!remainPersonCount[itemIdx + 1].MH && !remainPersonCount[itemIdx + 1].EH
                    && remainPersonCount[itemIdx + 1].NH < 0) {
                    const beforeN = allMonthShifts[schIdx].monthShifts[itemIdx - 1]
                    const afterN = allMonthShifts[schIdx].monthShifts[itemIdx + 1]
                    if (insertNChecker(beforeN, afterN)) {
                        allMonthShifts[schIdx].monthShifts[itemIdx] = [itemIdx + 1, 'NH']
                        if (!afterN) allMonthShifts[schIdx].monthShifts[itemIdx + 1] = [itemIdx + 2, 'OFF']
                        remainPersonCount[itemIdx + 1].NH += 1
                    }
                }
            }
            else if (item && !isHoliday) {
                if (remainPersonCount[itemIdx + 1].M > 0 && item[1] === 'M') {
                    allMonthShifts[schIdx].monthShifts[itemIdx] = [itemIdx + 1, 'OFF']
                    remainPersonCount[itemIdx + 1].M -= 1
                }
                else if (!remainPersonCount[itemIdx + 1].M && remainPersonCount[itemIdx + 1].E > 0 && item[1] === 'E') {
                    allMonthShifts[schIdx].monthShifts[itemIdx] = [itemIdx + 1, 'OFF']
                    remainPersonCount[itemIdx + 1].E -= 1
                }
                else if (!remainPersonCount[itemIdx + 1].M && !remainPersonCount[itemIdx + 1].E &&
                    remainPersonCount[itemIdx + 1].N > 0 && item[1] === 'N') {
                    allMonthShifts[schIdx].monthShifts[itemIdx] = [itemIdx + 1, 'OFF']
                    remainPersonCount[itemIdx + 1].N -= 1
                }
            }
            else if (item && isHoliday) {
                if (remainPersonCount[itemIdx + 1].MH > 0 && item[1] === 'MH') {
                    allMonthShifts[schIdx].monthShifts[itemIdx] = [itemIdx + 1, 'OFF']
                    remainPersonCount[itemIdx + 1].MH -= 1
                }
                else if (!remainPersonCount[itemIdx + 1].MH && remainPersonCount[itemIdx + 1].EH > 0 
                    && item[1] === 'EH') {
                    allMonthShifts[schIdx].monthShifts[itemIdx] = [itemIdx + 1, 'OFF']
                    remainPersonCount[itemIdx + 1].EH -= 1
                }
                else if (!remainPersonCount[itemIdx + 1].M && !remainPersonCount[itemIdx + 1].E &&
                    remainPersonCount[itemIdx + 1].N > 0 && item[1] === 'NH') {
                    allMonthShifts[schIdx].monthShifts[itemIdx] = [itemIdx + 1, 'OFF']
                    remainPersonCount[itemIdx + 1].NH -= 1
                }
            }
        })
    })

    return allMonthShifts
}