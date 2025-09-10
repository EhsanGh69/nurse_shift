import { personShifts } from "../constants/shifts";

export const getShiftDay = (shiftDay) => {
    const [_, shift, day] = shiftDay.match(/^([A-Z]+)(\d+)$/);
    return [shift, Number(day)];
};

export const getShiftRequestCount = (dayShifts = []) => {
    const requestCount = {M: 0, E: 0, N: 0, MH: 0, EH: 0, NH: 0}
    personShifts.forEach(pShift => {
        dayShifts.forEach(dShift => {
            if(pShift.includes("H") && dShift.shiftDay.includes("H")){
                const baseType = pShift.replace('H', '')
                if(dShift.shiftDay.includes(baseType)){
                    requestCount[pShift] += dShift.users.length
                }
            }else if(dShift.shiftDay.includes(pShift) && !dShift.shiftDay.includes("H")) {
                requestCount[pShift] += dShift.users.length
            }
        })
    })
    return requestCount;
}

export const getMatchCount = (shiftData, countObj) => {
    let matchCount = 0
    const shiftType = getShiftDay(shiftData.shiftDay)[0]
    Object.keys(countObj).forEach(key => {
        if(key.includes("H") && shiftType.includes("H")){
            const baseType = key.replace('H', '')
            if(shiftType.includes(baseType)){
                matchCount = countObj[key]
                return
            }
        }else if(shiftType.includes(key) && !shiftType.includes("H")){
            matchCount = countObj[key]
            return
        }
    })
    return matchCount
}

export const checkLeapYear = (year=1404) => {
    const diffYear = year - 1403
    if(diffYear % 4 === 0) return true
    return false
}
