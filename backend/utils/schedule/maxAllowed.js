const { stripH } = require("./helpers")

const computeMonthMax = (maxCounts) => {
    let monthMax = 0
    for (const shift in maxCounts) {
        if (shift === "CS") continue;
        else if(shift === "N") monthMax += maxCounts[shift] * 2
        else if(shift === "M" || shift === "E") monthMax += maxCounts[shift]
    }
    return monthMax
}

const generateMaxAllowed = (maxShifts) => {
    const maxAllowed = []
    for (const userMax of maxShifts) {
        if(!userMax.isMutable) continue;
        maxAllowed.push({ 
            user: String(userMax.user), 
            amounts: userMax.maxCounts, 
            monthMax: computeMonthMax(userMax.maxCounts)
        })
    }
    return maxAllowed
}

const getRemainAllowedCount = (userShifts, userAllowedCount) => {
    // get nurse shift count
  const nurseShiftsCount = { N: 0, CS: 0, E: 0, M: 0 }
  userShifts.forEach(item => {
    if (item) {
        const stripShift = stripH(item[1]) 
        switch (stripShift) {
            case 'M':
                nurseShiftsCount.M += 1
                break;
            case 'E':
                nurseShiftsCount.E += 1
                break;
            case 'N':
                nurseShiftsCount.N += 1
                break;
            case 'OFF':
                break;
            case 'V':
                break;
            default:
                if(stripShift.includes("M")) nurseShiftsCount.M += 1
                if(stripShift.includes("E")) nurseShiftsCount.E += 1
                if(stripShift.includes("N")) nurseShiftsCount.N += 1
                nurseShiftsCount.CS += 1
                break;
        }
    }
  })
 
//   get remain shift count
  const remainShiftCount = { N: 0, CS: 0, E: 0, M: 0 }
  Object.entries(nurseShiftsCount).forEach(([Nk, Nv]) => {
    Object.entries(userAllowedCount).forEach(([Ak, Av]) => {
      if (Nk === Ak && Av > 0) remainShiftCount[Nk] = Nv - Av
    })
  })

  return remainShiftCount;
}

const getMonthCount = (userShifts) => {
    let monthCount = 0
    userShifts.forEach(item => {
        if(item && item[1] !== "V" && item[1] !== "OFF"){
            const isCS = stripH(item[1]).length > 1
            const includeN = stripH(item[1]).includes("N")
            if(isCS && includeN) monthCount += 3
            else if(isCS && !includeN || !isCS && includeN) monthCount += 2
            else if(!isCS && !includeN) monthCount++
        } 
    })
    return monthCount
}

module.exports = {
    getRemainAllowedCount,
    getMonthCount,
    generateMaxAllowed
}