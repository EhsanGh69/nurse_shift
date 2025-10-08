import { Grid, Table, TableCell, TableContainer, TableRow, TableBody, Typography, TableHead } from '@mui/material'

import ArakMu from "../../assets/Arakmu.jpg";

export default function TablePageHeader({ 
    groupData, month, year, fridaysCount, holidaysCount, monthDaysCount, personCount
}) {
  return (
    <Grid container spacing={1} mt={2} mx={1}>
        <Grid size={{ xs: 4 }} textAlign="center">
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow sx={{ border: "1px solid #000" }}>
                            <TableCell align='center' size='small' padding='none'>
                                <Typography component='span' fontSize={12} mr={2} color='#000'>بیمارستان :</Typography>
                                <Typography component='span' fontSize={12} fontWeight={800} color='#000'>
                                    {groupData.hospital}
                                </Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none'>
                                <Typography component='span' fontSize={12} mr={2} color='#000'>بخش :</Typography>
                                <Typography component='span' fontSize={12} fontWeight={800} color='#000'>
                                    {groupData.department}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ border: "1px solid #000" }}>
                            <TableCell align='center' size='small' padding='none'>
                                <Typography component='span' fontSize={12} mr={2} color='#000'>ماه / سال :</Typography>
                                <Typography component='span' fontSize={12} fontWeight={800} color='#000'>
                                    {month} / {year}
                                </Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none'>
                                <Typography component='span' fontSize={12} mr={2} color='#000'>تعداد جمعه ها :</Typography>
                                <Typography component='span' fontSize={12} fontWeight={800} color='#000'>
                                    {fridaysCount}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ border: "1px solid #000" }}>
                            <TableCell align='center' size='small' padding='none'>
                                <Typography component='span' fontSize={12} mr={2} color='#000'>تعداد تعطیل رسمی :</Typography>
                                <Typography component='span' fontSize={12} fontWeight={800} color='#000'>
                                    {holidaysCount}
                                </Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none'>
                                <Typography component='span' fontSize={12} mr={2} color='#000'>تعداد روزهای غیرتعطیل :</Typography>
                                <Typography component='span' fontSize={12} fontWeight={800} color='#000'>
                                    {monthDaysCount - (holidaysCount + fridaysCount)}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
        <Grid size={{ xs: 2 }} textAlign="center">
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow sx={{ border: "1px solid #000" }}>
                            <TableCell align='center' size='small' padding='none'
                                sx={{ py: 1, display: "flex", flexDirection: "column", alignItems: "center" }}
                            >
                                <img src={ArakMu} alt="آرم دانشگاه علوم پزشکی" width={70} />
                                <Typography component='span' fontSize={8} fontWeight={900} color='#000'>
                                    دانشگاه علوم پزشکی استان {groupData.province}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ border: "1px solid #000" }}>
                            <TableCell align='center' size='small' padding='none'>
                                <Typography component='span' fontSize={8} fontWeight={500} color='#000'>حوزه درمان / دفتر پرستاری و مامایی</Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
        <Grid size={{ xs: 3 }} textAlign="center">
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow sx={{ border: "1px solid #000" }}>
                        <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                            <Typography component='span' fontSize={12} fontWeight={500} color='#000'>چیدمان شیفت</Typography>
                        </TableCell>
                        <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000", p: 0.2 }}>
                            <Typography component='span' fontSize={12} fontWeight={800} color='#000'>M</Typography>
                        </TableCell>
                        <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000", p: 0.2 }}>
                            <Typography component='span' fontSize={12} fontWeight={800} color='#000'>E</Typography>
                        </TableCell>
                        <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000", p: 0.2 }}>
                            <Typography component='span' fontSize={12} fontWeight={800} color='#000'>N</Typography>
                        </TableCell>
                        </TableRow>

                        <TableRow sx={{ border: "1px solid #000" }}>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span' fontSize={12} fontWeight={500} color='#000'>
                                    غیرتعطیل
                                </Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span' fontSize={12} fontWeight={500} color='#000'>
                                    {personCount?.M}
                                </Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span' fontSize={12} fontWeight={500} color='#000'>
                                    {personCount?.E}
                                </Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span' fontSize={12} fontWeight={500} color='#000'>
                                    {personCount?.N}
                                </Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow sx={{ border: "1px solid #000" }}>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span' fontSize={12} fontWeight={500} color='#000'>
                                    تعطیل
                                </Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span' fontSize={12} fontWeight={500} color='#000'>
                                    {personCount?.MH}
                                </Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span' fontSize={12} fontWeight={500} color='#000'>
                                    {personCount?.EH}
                                </Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span' fontSize={12} fontWeight={500} color='#000'>
                                    {personCount?.NH}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
        <Grid size={{ xs: 3 }} textAlign="center">
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ border: "1px solid #000" }}>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span'fontSize={12} fontWeight={800} color='#000'>MN</Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span'fontSize={12} fontWeight={800} color='#000'>ME</Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span'fontSize={12} fontWeight={800} color='#000'>EH</Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span'fontSize={12} fontWeight={800} color='#000'>MH</Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span'fontSize={12} fontWeight={800} color='#000'>OFF</Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span'fontSize={12} fontWeight={800} color='#000'>V</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{ border: "1px solid #000" }}>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span'fontSize={12} fontWeight={500} color='#000'>صبح شب</Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span'fontSize={12} fontWeight={500} color='#000'>صبح عصر</Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span'fontSize={12} fontWeight={500} color='#000'>عصر تعطیل</Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span'fontSize={12} fontWeight={500} color='#000'>صبح تعطیل</Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span'fontSize={12} fontWeight={500} color='#000'>بدون شیفت</Typography>
                            </TableCell>
                            <TableCell align='center' size='small' padding='none' sx={{ border: "1px solid #000" }}>
                                <Typography component='span'fontSize={12} fontWeight={500} color='#000'>مرخصی</Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    </Grid>
  )
}
