exports.getShiftDays = (shifts) => {
    const groups = {};
    const shiftOrder = { M: 0, E: 1, N: 2, OFF: 3, V: 4, ME: 5, MN: 6, NE: 7, EN: 8, NM: 9, NME: 10, MEN: 11 };

    shifts.forEach(shift => {
        const shiftId = shift._id;
        const fullname = `${shift.user.firstName} ${shift.user.lastName}`;
        const mobile = shift.user.mobile;

        Object.entries(shift.shiftDays).forEach(([type, days]) => {
            days.forEach(day => {
                const key = `${type}${day}`;
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push({ shiftId, fullname, mobile });
            });
        });
    });

    const result = Object
        .entries(groups)
        .sort(([aKey], [bKey]) => {
            const [, aType, aNum] = aKey.match(/^([A-Z]+)(\d+)$/);
            const [, bType, bNum] = bKey.match(/^([A-Z]+)(\d+)$/);

            if (shiftOrder[aType] !== shiftOrder[bType]) {
                return shiftOrder[aType] - shiftOrder[bType];
            }
            return parseInt(aNum, 10) - parseInt(bNum, 10);
        })
        .map(([shiftDay, users]) => ({
            shiftDay,
            users
        }));

    return result;
}

const getShiftDaysRow = (shiftDays) => {
    const dayToShift = {};
    for (const [shift, days] of Object.entries(shiftDays)) {
        for (const day of days) {
            dayToShift[day] = shift;
        }
    }
    return dayToShift;
}

const getShiftCounts = (shiftDays) => {
    const shiftCounts = {};
    for (const [shift, days] of Object.entries(shiftDays)) {
        shiftCounts[shift] = days.length;
    }
    return shiftCounts;
}

const getNonPromotionOperation = (shiftDays, hourCounts) => {
    const shiftCounts = getShiftCounts(shiftDays)
    let nonPromotionOperation = 0;
    for (const [shift, count] of Object.entries(shiftCounts)) {
        if(shift.includes("M"))
            nonPromotionOperation += count * hourCounts.NPM
        
        if(shift.includes("E"))
            nonPromotionOperation += count * hourCounts.NPE
        
        if(shift.includes("N"))
            nonPromotionOperation += count * hourCounts.NPN
    }
    return nonPromotionOperation;
}

const getPromotionOperation = (shiftDays, hourCounts) => {
    const shiftCounts = getShiftCounts(shiftDays)
    let promotionOperation = 0;
    for (const [shift, count] of Object.entries(shiftCounts)) {
        if(shift.includes("M")){
            if(shift.includes("H"))
                promotionOperation += count * hourCounts.PMH
            else
                promotionOperation += count * hourCounts.PM
        }
        
        if(shift.includes("E")){
            if(shift.includes("H"))
                promotionOperation += count * hourCounts.PEH
            else
                promotionOperation += count * hourCounts.PE
        }
        
        if(shift.includes("N")){
            if(shift.includes("H"))
                promotionOperation += count * hourCounts.PNH
            else
                promotionOperation += count * hourCounts.PN
        }
    }
    return promotionOperation;
}

exports.generateShiftsTable = (shifts, infos, settings) => {
    let shiftsTable = [];
      shifts.map((shift) => {
        infos.map(info => {
            if(String(shift.user._id) === String(info.user)){
                const nonPromotionOperation = getNonPromotionOperation(shift.shiftDays, settings.hourCount)
                const promotionOperation = getPromotionOperation(shift.shiftDays, settings.hourCount)
                const shiftsRow = {
                    fullname: `${shift.user.firstName} ${shift.user.lastName}`,
                    post: info.post,
                    employment: info.employment,
                    experience: info.experience,
                    hourReduction: info.hourReduction,
                    promotionDuty: info.promotionDuty,
                    nonPromotionDuty: info.nonPromotionDuty,
                    shiftDays: getShiftDaysRow(shift.shiftDays),
                    nonPromotionOperation,
                    promotionOperation,
                    nonPromotionOvertime: nonPromotionOperation - info.promotionDuty,
                    promotionOvertime: promotionOperation - info.promotionDuty
                };
                shiftsTable.push(shiftsRow)
            }
        })
    });
    return shiftsTable;
}