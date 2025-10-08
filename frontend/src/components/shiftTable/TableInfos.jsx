import { Grid, Table, TableCell, TableContainer, TableRow, Typography, TableBody } from '@mui/material'

import { postTitles, employTitles } from '../../constants/shifts';

export default function TableInfos() {
  return (
    <Grid container mt={1} mx={1}>
        <Grid size={{ xs: 12 }}>
            <TableContainer>
                <Table sx={{ borderCollapse: 'collapse' }}>
                    <TableBody>
                        <TableRow>
                            <TableCell 
                                align='left' padding='none'
                                sx={{ border: "1px solid #000", py: 2, pl: 1 }} 
                            >
                                <Typography component="span" fontSize={13} fontWeight={800} color='#000'>
                                    سمت ها: 
                                </Typography>
                                {postTitles.map((pTitle, index) => (
                                    <Typography 
                                        key={index} component="span" 
                                        fontSize={13} fontWeight={800} color='#000'
                                        mr={1}
                                    >
                                        {pTitle}
                                    </Typography>
                                ))}
                                
                            </TableCell>
                            <TableCell align='left' padding='none'
                                sx={{ border: "1px solid #000", pl: 1 }} 
                            >
                                <Typography component="span" fontSize={12} fontWeight={800} color='#000'>
                                    نوع استخدام : 
                                </Typography>
                                {employTitles.map((eTitle, index) => (
                                    <Typography 
                                        key={index} component="span" 
                                        fontSize={12} fontWeight={800} color='#000'
                                        mr={1}
                                    >
                                        {eTitle}
                                    </Typography>
                                ))}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    </Grid>
  )
}
