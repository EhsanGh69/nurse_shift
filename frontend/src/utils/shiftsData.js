export const getShiftDay = (shiftDay) => {
    if(shiftDay){
        const [_, shift, day] = shiftDay.match(/^([A-Z]+)(\d+)$/);
        return [shift, Number(day)];
    }
    return []
};

export const getShiftTypeCounts = (shiftDaySchedule = {}) => {
    const resultCount = {M: 0, E: 0, N: 0, MH: 0, EH: 0, NH: 0}
    for (const schType in shiftDaySchedule) {
        for (const resType in resultCount) {
            if(!schType.includes("H") && schType.includes(resType)) 
                resultCount[resType] += shiftDaySchedule[schType].length
            else if(schType.includes("H") && resType.includes("H")) {
                const baseType = resType.replace('H', '')
                if(schType.includes(baseType))
                    resultCount[resType] += shiftDaySchedule[schType].length
            }
        }
    }
    return resultCount;
}

export const checkLeapYear = (year=1404) => {
    const diffYear = year - 1403
    if(diffYear % 4 === 0) return true
    return false
}
