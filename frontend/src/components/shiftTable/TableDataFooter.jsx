import { TableCell, TableFooter, TableRow, Typography } from '@mui/material'

export default function TableDataFooter({ monthDays, totalHourDay, totalPromotions }) {

  return (
    <TableFooter>
        <TableRow>
            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000", py: 1 }} colSpan={8}>
                <Typography component="span" fontSize={12} fontWeight={800} color='#000'>
                    جمع کل ساعات شیفت
                </Typography>
            </TableCell>

            {monthDays.map(md => (
                <TableCell key={md} align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                    <Typography component="span" fontSize={12} fontWeight={800} color='#000'>
                        {totalHourDay[md]}
                    </Typography>
                </TableCell>
            ))}

            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={12} fontWeight={800} color='#000'>
                    {totalPromotions.totalNPOp}
                </Typography>
            </TableCell>
            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={12} fontWeight={800} color='#000'>
                    {totalPromotions.totalPO}
                </Typography>
            </TableCell>
            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={12} fontWeight={800} color='#000'>
                    {totalPromotions.totalNPOv}
                </Typography>
            </TableCell>
            <TableCell align='center' padding='none'  sx={{ border: "1px solid #000" }}>
                <Typography component="span" fontSize={12} fontWeight={800} color='#000'>
                    {totalPromotions.totalPOv}
                </Typography>
            </TableCell>
        </TableRow>
    </TableFooter>
  )
}
