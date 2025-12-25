import moment from "jalali-moment";

const generateMonthGrid = () => {
    const today = moment()
    // const currentYear = today.jYear()
    // const currentMonth = today.jMonth() + 1
    // const shiftMonth = currentMonth === 12 ? 1 : currentMonth + 1
    // const shiftYear = currentMonth === 12 ? currentYear + 1 : currentYear
    const shiftYear = today.jYear()
    const shiftMonth = today.jMonth() + 1

    const startDay = moment(`${shiftYear}/${shiftMonth}/1`, 'jYYYY/jM/jD').locale("fa").weekday()
    const daysInMonth = moment(`${shiftYear}/${shiftMonth}`, 'jYYYY/jM').locale("fa").daysInMonth()

    const totalCells = startDay + daysInMonth
    const totalRows = Math.ceil(totalCells / 7)
    const monthGrid = []
    let dayCounter = 1

    for(let i = 0; i < totalRows; i++){
        const week = []
        for(let j = 0; j < 7; j++){
            const cellIndex = i * 7 + j
            if(cellIndex < startDay || dayCounter > daysInMonth) 
                week.push(null)
            else
                week.push(dayCounter++)
        }
        monthGrid.push(week)
    }

    return {monthGrid, shiftMonth, shiftYear, daysInMonth};
} 

export default generateMonthGrid;