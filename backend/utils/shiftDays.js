const { daysInJalaliMonth } = require("./schedule/helpers")

exports.getMonthShifts = (shifts) => {
    const result = []
    shifts.forEach(shift => {
        const shiftId = shift._id;
        const description = shift.description
        const temporal = shift.temporal
        const fullname = `${shift.user.firstName} ${shift.user.lastName}`;
        const totalDays = daysInJalaliMonth(Number(shift.year), Number(shift.month))
        const monthShifts = Array(totalDays).fill(null)

        Object.entries(shift.shiftDays).forEach(([type, days]) => {
            days.forEach(day => {
                monthShifts[day - 1] = [day, type]
            });
        });
        result.push({ 
            shiftId, fullname, monthShifts: monthShifts.filter(item => item), description, temporal
        });
    });

    return result;
}

const getShiftDaysRow = (monthShifts) => {
    const dayToShift = {};
    monthShifts.forEach((shiftDay, index) => {
        if(shiftDay) dayToShift[shiftDay[0]] = shiftDay[1];
        else dayToShift[index + 1] = ""
    })
    return dayToShift;
}

const getShiftCounts = (monthShifts) => {
    const shiftCounts = {};
    monthShifts.forEach(shiftDay => {
        if(shiftDay) {
            if (shiftCounts[shiftDay[1]]) shiftCounts[shiftDay[1]] += 1
            else shiftCounts[shiftDay[1]] = 1
        }
    })
    return shiftCounts;
}

const getNonPromotionOperation = (monthShifts, hourCounts) => {
    const shiftCounts = getShiftCounts(monthShifts)
    let nonPromotionOperation = 0;
    for (const [shift, count] of Object.entries(shiftCounts)) {
        if(!shift.includes("H")) {
            if(shift.includes("M")) nonPromotionOperation += count * hourCounts.get('NPM')
        
            if(shift.includes("E")) nonPromotionOperation += count * hourCounts.get('NPE')
        
            if(shift.includes("N")) nonPromotionOperation += count * hourCounts.get('NPN')
        }
        if(shift.includes("V")) nonPromotionOperation += count * hourCounts.get('V')
    }
    return nonPromotionOperation;
}

const getPromotionOperation = (monthShifts, hourCounts) => {
    const shiftCounts = getShiftCounts(monthShifts)
    let promotionOperation = 0;
    for (const [shift, count] of Object.entries(shiftCounts)) {
        if(shift.includes("M")){
            if(shift.includes("H")) promotionOperation += count * hourCounts.get('PM')
            else promotionOperation += count * hourCounts.get('NPM')
        }
        if(shift.includes("E")){
            if(shift.includes("H")) promotionOperation += count * hourCounts.get('PE')
            else promotionOperation += count * hourCounts.get('NPE')
        }
        if(shift.includes("N")) promotionOperation += count * hourCounts.get('PN') 
        
        if(shift.includes("V")) promotionOperation += count * hourCounts.get('V')
    }
    return promotionOperation;
}

exports.generateShiftsTable = (monthSchedule, infos, hourCount) => {
    let shiftsTable = [];
      monthSchedule.map((shift) => {
        infos.map(info => {
            if(String(shift.user._id) === String(info.user)){
                const nonPromotionOperation = getNonPromotionOperation(shift.monthShifts, hourCount)
                const promotionOperation = getPromotionOperation(shift.monthShifts, hourCount)
                const nonPromotionOvertime = nonPromotionOperation - info.nonPromotionDuty
                const promotionOvertime = promotionOperation - info.promotionDuty
                const shiftsRow = {
                    firstName: shift.user.firstName,
                    lastName: shift.user.lastName,
                    post: info.post,
                    employment: info.employment,
                    experience: info.experience,
                    hourReduction: info.hourReduction,
                    promotionDuty: info.promotionDuty,
                    nonPromotionDuty: info.nonPromotionDuty,
                    shiftDays: getShiftDaysRow(shift.monthShifts),
                    nonPromotionOperation,
                    promotionOperation,
                    nonPromotionOvertime: nonPromotionOvertime < 0 ? 0 : nonPromotionOvertime,
                    promotionOvertime: promotionOvertime < 0 ? 0 : promotionOvertime
                };
                shiftsTable.push(shiftsRow)
            }
        })
    });
    return shiftsTable;
}

exports.getHourCountDay = (monthSchedule, hourCount) => {
    const monthDays = [...Array(31).keys()].map(i => String(i + 1))
    const allShiftToDays = []
    monthSchedule.map(sch => allShiftToDays.push(getShiftDaysRow(sch.monthShifts)))
    const totalHourDay = {}
    monthDays.map(mDay => {
        totalHourDay[mDay] = 0
        allShiftToDays.map(stDay => {
            if(stDay[mDay]){
                if(stDay[mDay].includes('M')){
                    if(stDay[mDay].includes('H')) totalHourDay[mDay] += hourCount.get('PM')
                    else totalHourDay[mDay] += hourCount.get('NPM')
                }
                if(stDay[mDay].includes("E")){
                    if(stDay[mDay].includes('H')) totalHourDay[mDay] += hourCount.get('PE')
                    else totalHourDay[mDay] += hourCount.get('NPE')
                }
                if(stDay[mDay].includes("N")) totalHourDay[mDay] += hourCount.get('PN')
                if(stDay[mDay].includes("V")) totalHourDay[mDay] += hourCount.get('V')
            }
        })
    })
    return totalHourDay
}