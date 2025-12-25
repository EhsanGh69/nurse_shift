const { daysInJalaliMonth, stripH, getIsHolidaysMap } = require("./helpers")
const { getRemainAllowedCount, getMonthCount } = require("./maxAllowed")
const { getRequestedDays, insertNChecker, checkShiftAround } 
= require("./scheduleFunctions")

const daysAndRequests = (year, month, requestedShifts, maxAllowed) => {
    const totalDays = daysInJalaliMonth(year, month)
    const holidayMap = getIsHolidaysMap(year, month)
    const requestedDays = getRequestedDays(requestedShifts, maxAllowed)
    return { totalDays, holidayMap, requestedDays }
}

const shiftDayRemains = (user, allowedCount, day, year, month) => {
    let remainAllowedCount = getRemainAllowedCount(user.monthShifts, allowedCount);
    const userShiftsCount = getMonthCount(user.monthShifts)
    const isHoliday = getIsHolidaysMap(year, month)[day]
    const YDay = user.monthShifts[day - 1]
    const TDay = user.monthShifts[day + 1]
    return { remainAllowedCount, userShiftsCount, isHoliday, YDay, TDay }
}

const personsStatus = (shiftType, isHoliday, remainPersonCount, statusType="") => {
    let shiftShortage = false;
    let shiftSurplus = false;
    switch (shiftType) {
        case "N":
            if(statusType === "shortage")
                shiftShortage = isHoliday ? remainPersonCount.NH < 0 : remainPersonCount.N < 0
            else
                shiftSurplus = isHoliday ? remainPersonCount.NH > 0 : remainPersonCount.N > 0
            break;
        case "E":
            if(statusType === "shortage")
                shiftShortage = isHoliday ? remainPersonCount.EH < 0 : remainPersonCount.E < 0
            else
                shiftSurplus = isHoliday ? remainPersonCount.EH > 0 : remainPersonCount.E > 0
            break;
        case "M":
            if(statusType === "shortage")
                shiftShortage = isHoliday ? remainPersonCount.MH < 0 : remainPersonCount.M < 0
            else
                shiftSurplus = isHoliday ? remainPersonCount.MH > 0 : remainPersonCount.M > 0
            break;
    }
    return statusType === "shortage" ? shiftShortage : shiftSurplus
}

const insertShiftController = (shiftType="", user={}, date={}, shiftCount={}, boolOpt="") => {
    const { day, year, month } = date
    const { remainPersonCount, monthMax, allowedCount } = shiftCount
    const { remainAllowedCount, userShiftsCount, isHoliday, YDay, TDay } = 
    shiftDayRemains(user, allowedCount, day, year, month)
    const notNBefore = !YDay || YDay && !stripH(YDay[1]).includes("N")

    let insertResult = false
    switch (shiftType) {
        case "N":
            const shortageN = personsStatus("N", isHoliday, remainPersonCount, "shortage")
            const allowedN = boolOpt === "&&" ? userShiftsCount <= monthMax && remainAllowedCount.N <= 0
            : userShiftsCount <= monthMax && remainAllowedCount.N < 0
            const checkNCount = boolOpt === "&&" ? shortageN && allowedN : shortageN || allowedN
            const checkNAround = insertNChecker(YDay, TDay) && checkShiftAround(user.monthShifts, day, "N")
            if (checkNCount && checkNAround) {
                user.monthShifts[day] = isHoliday ? [day + 1, "NH"] : [day + 1, "N"]
                user.monthShifts[day + 1] = [day + 2, 'OFF']
                insertResult = true
            }
            break;
        case "E":
            const shortageE = personsStatus("E", isHoliday, remainPersonCount, "shortage")
            const allowedE = boolOpt === "&&" ? userShiftsCount <= monthMax && remainAllowedCount.E <= 0
            : userShiftsCount <= monthMax && remainAllowedCount.E < 0
            const checkECount = boolOpt === "&&" ? shortageE && allowedE : shortageE || allowedE
            if (checkECount && notNBefore) {
                user.monthShifts[day] = isHoliday ? [day + 1, "EH"] : [day + 1, "E"]
                insertResult = true
            }
            break;
        case "M":
            const shortageM = personsStatus("M", isHoliday, remainPersonCount, "shortage")
            const allowedM = boolOpt === "&&" ? userShiftsCount <= monthMax && remainAllowedCount.M <= 0
            : userShiftsCount <= monthMax && remainAllowedCount.M < 0
            const checkMCount = boolOpt === "&&" ? shortageM && allowedM : shortageM || allowedM
            if (checkMCount && notNBefore) {
                user.monthShifts[day] = isHoliday ? [day + 1, "MH"] : [day + 1, "M"]
                insertResult = true
            }
            break;
        case "MN":
            const shortageMN = personsStatus("M", isHoliday, remainPersonCount, "shortage") &&
            personsStatus("N", isHoliday, remainPersonCount, "shortage")
            const allowedMN = userShiftsCount <= monthMax && remainAllowedCount.CS < 0
            const checkMNAround = insertNChecker(YDay) && checkShiftAround(user.monthShifts, day, "MN")
            if (shortageMN && allowedMN && checkMNAround) {
                user.monthShifts[day] = isHoliday ? [day + 1, "MNH"] : [day + 1, "MN"]
                user.monthShifts[day + 1] = [day + 2, 'OFF']
                insertResult = true
            }
            break;
        case "ME":
            const shortageME = personsStatus("M", isHoliday, remainPersonCount, "shortage") &&
            personsStatus("E", isHoliday, remainPersonCount, "shortage")
            const allowedME = userShiftsCount <= monthMax && remainAllowedCount.CS < 0
            const checkMEAround = checkShiftAround(user.monthShifts, day, "ME")
            if (shortageME && allowedME && checkMEAround) {
                user.monthShifts[day] = isHoliday ? [day + 1, "MEH"] : [day + 1, "ME"]
                insertResult = true
            }
            break;
    }
    return insertResult;
}

const removeShiftController = (shiftDay, isHoliday, remainPersonCount) => {
    let isSurplus = false;
    const stripShift = stripH(shiftDay[1])
    switch (stripShift) {
        case 'M':
            isSurplus = personsStatus("M", isHoliday, remainPersonCount, "surplus")
            break;
        case 'E':
            isSurplus = personsStatus("E", isHoliday, remainPersonCount, "surplus")
            break;
        case 'N':
            isSurplus = personsStatus("N", isHoliday, remainPersonCount, "surplus")
            break;
        case 'MN':
            isSurplus = personsStatus("N", isHoliday, remainPersonCount, "surplus") &&
            personsStatus("M", isHoliday, remainPersonCount, "surplus") 
            break;
        case 'ME':
            isSurplus = personsStatus("M", isHoliday, remainPersonCount, "surplus") &&
            personsStatus("E", isHoliday, remainPersonCount, "surplus")
            break;
    }
    return isSurplus
}

module.exports = {
    daysAndRequests,
    insertShiftController,
    removeShiftController,
    shiftDayRemains
}