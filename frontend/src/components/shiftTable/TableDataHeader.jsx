import { TableCell, TableHead, TableRow, Typography } from '@mui/material'

import { cellRotate, textRotate } from '../../styles/tableStyles'

export default function TableDataHeader({ monthWeekDays, monthDays }) {
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
                    sx={{ border: "1px solid #000" }}>
                    <Typography component="span" fontSize={10} fontWeight={800} color='#000'>
                        {md}
                    </Typography>
                </TableCell>
            ))}
        </TableRow>

        <TableRow>
            {monthWeekDays.map((mwd, idx) => (
                <TableCell align='center' sx={cellRotate} padding='none' key={idx}>
                    <Typography component="span" sx={textRotate} color='#000'>
                        {mwd}
                    </Typography>
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
  )
}
