const { stripH } = require("./helpers")

const maxAllowed = [
    {
        // NezamAbad
        user: "6926c249cdb927f2c1695cce",
        amounts: {OFF: 5, N: 5, CS: 1, E: 6, M: 8},
        monthMax: 21,
        favCS: "ME"
    },
    {
        // MirzaeiRad
        user: "6926c314cdb927f2c1695cee",
        amounts: {OFF: 6, N: 7, CS: 2, E: 8, M: 1},
        monthMax: 20,
        favCS: "ME"
    },
    {
        // Soofi
        user: "6926c32fcdb927f2c1695cf6",
        amounts: {OFF: 6, N: 5, CS: 2, E: 10, M: 3},
        monthMax: 22,
        favCS: "ME"
    },
    {
        // Rezaei
        user: "6926c34ecdb927f2c1695cfe",
        amounts: {OFF: 6, N: 5, CS: 2, E: 5, M: 8},
        monthMax: 22,
        favCS: "ME"
    },
    {
        // YeganehFard
        user: "6926c373cdb927f2c1695d06",
        amounts: {OFF: 6, N: 5, CS: 2, E: 6, M: 7},
        monthMax: 22,
        favCS: "ME"
    },
    {
        // Alimohammadi
        user: "6926c39ecdb927f2c1695d10",
        amounts: {OFF: 8, N: 10, CS: 2, E: 4, M: 0},
        monthMax: 18,
        favCS: "ME"
    },
    {
        // Akbari
        user: "6926c3d1cdb927f2c1695d18",
        amounts: {OFF: 5, N: 8, CS: 2, E: 5, M: 3},
        monthMax: 20,
        favCS: "ME"
    },
    {
        // Eini
        user: "6926c3f6cdb927f2c1695d20",
        amounts: {OFF: 5, N: 8, CS: 2, E: 5, M: 3},
        monthMax: 20,
        favCS: "ME"
    },
    {
        // Goodarzi
        user: "6926c40fcdb927f2c1695d28",
        amounts: {OFF: 6, N: 8, CS: 0, E: 8, M: 6},
        monthMax: 22,
        favCS: ""
    },
    {
        // Najafi
        user: "6926c43acdb927f2c1695d30",
        amounts: {OFF: 4, N: 7, CS: 2, E: 7, M: 3},
        monthMax: 21,
        favCS: "ME"
    },
    {
        // Zarei
        user: "6926c456cdb927f2c1695d38",
        amounts: {OFF: 10, N: 10, CS: 0, E: 0, M: 0},
        monthMax: 10,
        favCS: ""
    },
    {
        // Hemmati
        user: "6926c477cdb927f2c1695d40",
        amounts: {OFF: 10, N: 10, CS: 0, E: 0, M: 0},
        monthMax: 10,
        favCS: "MN"
    },
    {
        // Shaabani
        user: "6926c496cdb927f2c1695d48",
        amounts: {OFF: 4, N: 8, CS: 3, E: 4, M: 3},
        monthMax: 21,
        favCS: "MN"
    },
    {
        // Shokri
        user: "6926c4cccdb927f2c1695d50",
        amounts: {OFF: 4, N: 8, CS: 3, E: 4, M: 3},
        monthMax: 21,
        favCS: "MN"
    },
]

const getRemainAllowedCount = (userId, userShifts) => {
    const userAllowedCount = maxAllowed.find(userMax => userMax.user === String(userId))?.amounts
    if(!userAllowedCount) return false

    // get nurse shift count
  const nurseShiftsCount = { OFF: 0, N: 0, CS: 0, E: 0, M: 0 }
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
                const NCheck = userShifts[index - 1] && !stripH(userShifts[index - 1][1]).includes("N")
                if (!userShifts[index - 1] || NCheck) nurseShiftsCount.OFF += 1
                break;
            default:
                nurseShiftsCount.CS += 1
                break;
        }
    }
  })

 
  // get remain shift count
  const remainShiftCount = { OFF: 0, N: 0, CS: 0, E: 0, M: 0 }
  Object.entries(nurseShiftsCount).forEach(([Nk, Nv]) => {
    Object.entries(userAllowedCount).forEach(([Ak, Av]) => {
      if (Nk === Ak) remainShiftCount[Nk] = Nv - Av
    })
  })

  return remainShiftCount;
}

const getMonthCount = (userShifts) => {
    let monthCount = 0
    userShifts.forEach(item => {
        if(item && item[1] !== "V" && item[1] !== "OFF"){
            if(stripH(item[1]).length > 1) monthCount += 2
            else monthCount++
        } 
    })
    return monthCount
}

module.exports = {
    maxAllowed,
    getRemainAllowedCount,
    getMonthCount
}