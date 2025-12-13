import { useContext } from 'react'
import { TableCell, TableHead, TableRow, Typography } from '@mui/material'
import moment from "jalali-moment";

import { cellRotate, textRotate } from '../../styles/tableStyles'
import ShiftsContext from '../../context/ShiftsContext';


export default function TableDataHeader({ monthWeekDays, monthDays }) {
    const { shiftMonth, shiftYear, checkHoliday } = useContext(ShiftsContext)

    const isHoliday = (day) => {
        const weekDay = moment(`${shiftYear}/${shiftMonth}/${day}`, 'jYYYY/jM/jD').locale("fa").weekday()
        if(checkHoliday(day) || weekDay === 6) return true
        return false
    }

  return (
    <TableHead>
        <TableRow>
            <TableCell align='center' sx={cellRotate} padding='none' rowSpan={3}>
                <Typography component="span" sx={textRotate} color='#000'>
                    ردیف
                </Typography>
            </TableCell>
            <TableCell align='center' padding='none' rowSpan={3} sx={{ p: 1, border: "1px solid #000" }}>
                <Typography component="p" fontSize={10} fontWeight={800} color='#000'>
                    نام و
                </Typography>
                <Typography component="p" fontSize={10} fontWeight={800} color='#000'>
                    نام خانوادگی
                </Typography>
            </TableCell>
            <TableCell align='center' sx={cellRotate} padding='none' rowSpan={3}>
                <Typography component="span" sx={textRotate} color='#000'>
                    سمت
                </Typography>
            </TableCell>
            <TableCell align='center' sx={cellRotate} padding='none' rowSpan={3}>
                <Typography component="p" sx={textRotate} color='#000'>
                    نوع
                </Typography>
                <Typography component="p" sx={textRotate} color='#000'>
                    استخدام
                </Typography>
            </TableCell>
            <TableCell align='center' sx={cellRotate} padding='none' rowSpan={3}>
                <Typography component="p" sx={textRotate} color='#000'>
                    سابقه
                </Typography>
                <Typography component="p" sx={textRotate} color='#000'>
                    خدمت
                </Typography>
            </TableCell>
            <TableCell align='center' sx={cellRotate} padding='none' rowSpan={3}>
                <Typography component="p" sx={textRotate} color='#000'>
                    تقلیل
                </Typography>
                <Typography component="p" sx={textRotate} color='#000'>
                    ساعت
                </Typography>
            </TableCell>
            <TableCell align='center' sx={cellRotate} padding='none' rowSpan={3}>
                <Typography component="p" sx={textRotate} color='#000'>
                    موظفی
                </Typography>
                <Typography component="p" sx={textRotate} color='#000'>
                    با ارتقاء
                </Typography>
            </TableCell>
            <TableCell align='center' sx={cellRotate} padding='none' rowSpan={3}>
                <Typography component="p" sx={textRotate} color='#000'>
                    موظفی
                </Typography>
                <Typography component="p" sx={textRotate} color='#000'>
                    بدون ارتقاء
                </Typography>
            </TableCell>
            <TableCell align='center' padding='none' colSpan={30} sx={{ py: 0.5, border: "1px solid #000" }}>
                <Typography component="span" fontSize={10} fontWeight={800} color='#000'>
                    ایام ماه
                </Typography>
            </TableCell>
            <TableCell align='center' sx={cellRotate} padding='none' rowSpan={3}>
                <Typography component="p" sx={textRotate} color='#000'>
                    کارکرد ماه
                </Typography>
                <Typography component="p" sx={textRotate} color='#000'>
                    بدون ارتقاء
                </Typography>
            </TableCell>
            <TableCell align='center' sx={cellRotate} padding='none' rowSpan={3}>
                <Typography component="p" sx={textRotate} color='#000'>
                    کارکرد ماه
                </Typography>
                <Typography component="p" sx={textRotate} color='#000'>
                    با ارتقاء
                </Typography>
            </TableCell>
            <TableCell align='center' sx={cellRotate} padding='none' rowSpan={3}>
                <Typography component="p" sx={textRotate} color='#000'>
                    اضافه کار
                </Typography>
                <Typography component="p" sx={textRotate} color='#000'>
                    بدون ارتقاء
                </Typography>
            </TableCell>
            <TableCell align='center' sx={cellRotate} padding='none' rowSpan={3}>
                <Typography component="p" sx={textRotate} color='#000'>
                    اضافه کار
                </Typography>
                <Typography component="p" sx={textRotate} color='#000'>
                    با ارتقاء
                </Typography>
            </TableCell>
        </TableRow>

        <TableRow>
            {monthDays.map(md => (
                <TableCell align='center' padding='none' key={md} 
                    sx={{ 
                        border: "1px solid #000", 
                        backgroundColor: isHoliday(Number(md)) ? "darkred" : "inherit" 
                    }}>
                    <Typography component="span" fontSize={10} fontWeight={800} 
                    color={isHoliday(Number(md)) ? "#fff" : "#000"}>
                        {md}
                    </Typography>
                </TableCell>
            ))}
        </TableRow>

        <TableRow>
            {monthWeekDays.map((mwd, idx) => (
                <TableCell align='center' sx={{ 
                    ...cellRotate , 
                    backgroundColor: isHoliday(idx + 1) ? "darkred" : "inherit" }} 
                    padding='none' key={idx}>
                    <Typography component="span" sx={textRotate} 
                    color={isHoliday(idx + 1) ? "#fff" : "#000"}>
                        {mwd}
                    </Typography>
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
  )
}
