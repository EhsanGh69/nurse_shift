exports.getShiftDays = (shifts) => {
    const groups = {};
    const shiftOrder = { M: 0, E: 1, N: 2, OFF: 3, V: 4, ME: 5, MN: 6, NE: 7, EN: 8, NM: 9, NME: 10, MEN: 11 };

    shifts.forEach(shift => {
        const shiftId = shift._id;
        const fullname = `${shift.user.firstName} ${shift.user.lastName}`;

        Object.entries(shift.shiftDays).forEach(([type, days]) => {
            days.forEach(day => {
                const key = `${type}${day}`;
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push({ shiftId, fullname });
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