const { stripH } = require("./helpers")

const maxAllowed = [
    /*
        {
            // Roodbarani
            user: "6926b295bff30de5f59c8049",
            amounts: {N: 0, CS: 0, E: 0, M: 24},
            monthMax: 24
        },
        {
            // Barari
            user: "6926c0e4cdb927f2c1695cbe",
            amounts: {N: 0, CS: 0, E: 0, M: 24},
            monthMax: 24
        },
        {
            // HoseinAbad
            user: "6926c20ecdb927f2c1695cc6",
            amounts: {N: 6, CS: 0, E: 12, M: 0},
            monthMax: 24
        },
        {
            // Anari
            user: "6926c29dcdb927f2c1695cd6",
            amounts: {N: 5, CS: 4, E: 7, M: 8},
            monthMax: 25
        },
        {
            // Shaabani-Saaid
            user: "6926c2c6cdb927f2c1695cde",
            amounts: {N: 6, CS: 0, E: 6, M: 7},
            monthMax: 25
        },
        {
            // Mohammadi
            user: "6926c2f2cdb927f2c1695ce6",
            amounts: {N: 0, CS: 0, E: 0, M: 22},
            monthMax: 22
        },
    */
    //*-----------------------------------------------------------

    {
        // NezamAbad
        user: "6926c249cdb927f2c1695cce",
        amounts: {N: 5, CS: 2, E: 6, M: 9},
        monthMax: 25
    },
    {
        // MirzaeiRad
        user: "6926c314cdb927f2c1695cee",
        amounts: {N: 6, CS: 3, E: 8, M: 6},
        monthMax: 26
    },
    {
        // Soofi
        user: "6926c32fcdb927f2c1695cf6",
        amounts: {N: 5, CS: 3, E: 10, M: 6},
        monthMax: 26
    },
    {
        // Rezaei
        user: "6926c34ecdb927f2c1695cfe",
        amounts: {N: 5, CS: 3, E: 8, M: 8},
        monthMax: 26
    },
    {
        // YeganehFard
        user: "6926c373cdb927f2c1695d06",
        amounts: {N: 5, CS: 3, E: 8, M: 8},
        monthMax: 26
    },
    {
        // Alimohammadi
        user: "6926c39ecdb927f2c1695d10",
        amounts: {N: 10, CS: 2, E: 4, M: 2},
        monthMax: 26
    },
    {
        // Akbari
        user: "6926c3d1cdb927f2c1695d18",
        amounts: {N: 7, CS: 2, E: 5, M: 7},
        monthMax: 26
    },
    {
        // Eini
        user: "6926c3f6cdb927f2c1695d20",
        amounts: {N: 9, CS: 2, E: 6, M: 2},
        monthMax: 26
    },
    {
        // Goodarzi
        user: "6926c40fcdb927f2c1695d28",
        amounts: {N: 7, CS: 0, E: 6, M: 6},
        monthMax: 26
    },
    {
        // Najafi
        user: "6926c43acdb927f2c1695d30",
        amounts: {N: 7, CS: 3, E: 9, M: 5},
        monthMax: 28
    },
    {
        // Zarei
        user: "6926c456cdb927f2c1695d38",
        amounts: {N: 11, CS: 0, E: 0, M: 0},
        monthMax: 22
    },
    {
        // Hemmati
        user: "6926c477cdb927f2c1695d40",
        amounts: {N: 7, CS: 3, E: 9, M: 5},
        monthMax: 28
    },
    {
        // Shaabani
        user: "6926c496cdb927f2c1695d48",
        amounts: {N: 9, CS: 3, E: 7, M: 4},
        monthMax: 29
    },
    {
        // Shokri
        user: "6926c4cccdb927f2c1695d50",
        amounts: {N: 9, CS: 3, E: 7, M: 4},
        monthMax: 29
    },
]

const getRemainAllowedCount = (userId, userShifts) => {
    const userAllowedCount = maxAllowed.find(userMax => userMax.user === String(userId))?.amounts
    if(!userAllowedCount) return false
    // get nurse shift count
  const nurseShiftsCount = { N: 0, CS: 0, E: 0, M: 0 }
  userShifts.forEach((item, index) => {
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
    maxAllowed,
    getRemainAllowedCount,
    getMonthCount
}