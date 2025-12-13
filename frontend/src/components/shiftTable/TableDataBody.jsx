import { useContext } from 'react'
import { TableBody, TableCell, TableRow, Typography } from '@mui/material'
import moment from "jalali-moment";

import ShiftsContext from '../../context/ShiftsContext';

export default function TableDataBody({ rowNumber, dataRow, monthDays }) {
    const { shiftMonth, shiftYear, checkHoliday } = useContext(ShiftsContext)

    const generateMonthShiftDays = () => {
        const monthSiftDays = {}
        monthDays.forEach(md => {
            monthSiftDays[md] = '-'
            if(dataRow.shiftDays[md]) monthSiftDays[md] = dataRow.shiftDays[md] 
        })
        return monthSiftDays
    }

    const isHoliday = (day) => {
        const weekDay = moment(`${shiftYear}/${shiftMonth}/${day}`, 'jYYYY/jM/jD').locale("fa").weekday()
        if(checkHoliday(day) || weekDay === 6) return true
        return false
    }

  return (
    <TableBody>
        <TableRow>
            <TableCell align='center' padding='none' sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={12} fontWeight={500} color='#000'>
                    {rowNumber}
                </Typography>
            </TableCell>
            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={12} fontWeight={500} color='#000'>
                    {dataRow.firstName}{" "}{dataRow.lastName}
                </Typography>
            </TableCell>
            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={12} fontWeight={500} color='#000'>
                    {dataRow.post}
                </Typography>
            </TableCell>
            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={12} fontWeight={500} color='#000'>
                    {dataRow.employment}
                </Typography>
            </TableCell>
            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={12} fontWeight={500} color='#000'>
                    {dataRow.experience}
                </Typography>
            </TableCell>
            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={12} fontWeight={500} color='#000'>
                    {dataRow.hourReduction}
                </Typography>
            </TableCell>
            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={12} fontWeight={500} color='#000'>
                    {dataRow.promotionDuty}
                </Typography>
            </TableCell>
            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={12} fontWeight={500} color='#000'>
                    {dataRow.nonPromotionDuty}
                </Typography>
            </TableCell>

            {monthDays.map(md => {
                return (
                    <TableCell key={md} align='center' padding='none'  
                        sx={{
                            border: "1px solid #000", 
                            backgroundColor: isHoliday(Number(md)) ? "darkred" : "inherit"
                        }}>
                        <Typography component="span" fontSize={12} fontWeight={500} 
                            color={isHoliday(Number(md)) ? "#fff" : "#000"}
                        >
                            {generateMonthShiftDays()[md].includes("H") 
                            ? generateMonthShiftDays()[md].slice(0, -1) : generateMonthShiftDays()[md]}
                        </Typography>
                    </TableCell>
                )
            })}

            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={10} fontWeight={800} color='#000'>
                    {dataRow.nonPromotionOperation}
                </Typography>
            </TableCell>
            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={10} fontWeight={800} color='#000'>
                    {dataRow.promotionOperation}
                </Typography>
            </TableCell>
            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={10} fontWeight={800} color='#000'>
                    {dataRow.nonPromotionOvertime}
                </Typography>
            </TableCell>
            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={10} fontWeight={800} color='#000'>
                    {dataRow.promotionOvertime}
                </Typography>
            </TableCell>
        </TableRow>
    </TableBody>
  )
}