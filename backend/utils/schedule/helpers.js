const path = require('path')
const fs = require('fs')
const moment = require('jalali-moment')

const daysInJalaliMonth = (year, month) => {
    if (month >= 1 && month <= 6) return 31
    if (month >= 7 && month <= 11) return 30
    try {
        const start = moment.from(`${year}/${String(month).padStart(2,'0')}/01`, 'fa', 'YYYY/MM/DD')
        const nextMonth = start.clone().add(1, 'jMonth')
        return nextMonth.diff(start, 'days')
    } catch (e) {
        return 30
    }
}

const holidaysFile = path.join(__dirname, '..', '..', 'json', 'holidays.json')
 
const getIsHolidaysMap = (year, month) => {
    let holidays = []
    const raw = fs.readFileSync(holidaysFile, 'utf8')
    const all = JSON.parse(raw)
    holidays = all.holidays
        .filter(h => Number(h.year) === Number(year) && Number(h.month) === Number(month))
        .map(h => Number(h.day))

    const totalDays = daysInJalaliMonth(year, month)
    const isHolidayMap = Array(totalDays).fill(false)
    for (let d = 1; d <= totalDays; d++) {
        if (holidays.includes(d)) { isHolidayMap[d - 1] = true; continue }
        try {
            const jm = moment.from(`${year}/${String(month).padStart(2,'0')}/${String(d).padStart(2,'0')}`, 'fa', 'YYYY/MM/DD')
            if (jm.day() === 5) isHolidayMap[d - 1] = true // friday
        } catch (e) { /* ignore */ }
    }
    return isHolidayMap
}


const stripH = (k) => (typeof k === 'string' && k.endsWith('H')) ? k.slice(0, -1) : k

module.exports = {
    daysInJalaliMonth,
    stripH,
    getIsHolidaysMap
}