import { useEffect, useState } from 'react';
import { Divider, Grid, Paper, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from "@mui/material/styles";

import { useShiftSettings } from "../../api/shiftManagement.api";
import useShiftStore from '../../store/shiftStore';
import { getShiftTypeCounts } from "../../utils/shiftsData";
import { personShifts } from "../../constants/shifts"

export default function ShiftsCountBox({ shiftDaySchedule }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const isDownMd = useMediaQuery(theme.breakpoints.down('md'))
    const [settingCount, setSettingCount] = useState(null)
    const { groupId } = useShiftStore()
    const { data, isLoading } = useShiftSettings(groupId)
    
    useEffect(() => {
        if(!isLoading && data) setSettingCount(data.personCount)
    }, [data, isLoading])


    return (
        <>
            <Grid size={{ xs: 12, md: 5 }} display="flex" 
                borderRadius={2}
                border="2px solid #cfaeaeff"
                flexDirection="column" mt={2} p={4}>
                <Typography
                    variant='h6' align='center' gutterBottom
                    sx={{ color: isDark ? '#f5f5f5' : '#1e1e1e' }}
                >
                    چیدمان کنونی
                </Typography>
                <Grid container spacing={2}>
                    {settingCount &&  personShifts.map(shiftType => (
                        <Grid size={{ xs:4, lg:2 }} key={shiftType}>
                            <Paper elevation={3} 
                                sx={isDownMd 
                                    ? { p: 1, display: "flex", justifyContent:"space-around" }
                                    : { py: 1, px: 0.5, textAlign: "center" }
                                }
                            >
                                <Typography variant="h6">{shiftType}</Typography>
                                <Divider 
                                    flexItem sx={{ backgroundColor: "info.main" }} 
                                    orientation={isDownMd ? 'vertical' : 'horizontal'} 
                                />
                                <Typography 
                                    variant="h5" mt={isDownMd ? 0 : 1}
                                    color={getShiftTypeCounts(shiftDaySchedule)[shiftType] !== 
                                        settingCount[shiftType] ? "error" : "success"} 
                                >
                                    {getShiftTypeCounts(shiftDaySchedule)[shiftType]}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            <Grid 
                size={{ xs: 12, md: 5 }} display="flex" 
                flexDirection="column" mt={2} p={4}
                borderRadius={2}
                border="2px solid #cfaeaeff"
            >
                <Typography
                    variant='h6' align='center' gutterBottom
                    sx={{ color: isDark ? '#f5f5f5' : '#1e1e1e' }}
                >
                    چیدمان تنظیمات
                </Typography>
                <Grid container spacing={2}>
                    {settingCount && personShifts.map(shiftType => (
                        <Grid size={{ xs:4, lg:2 }} key={shiftType}>
                            <Paper elevation={3} 
                                sx={isDownMd 
                                    ? { p: 1, display: "flex", justifyContent:"space-around" }
                                    : { py: 1, px: 0.5, textAlign: "center" }
                                }
                            >
                                <Typography variant="h6">{shiftType}</Typography>
                                <Divider 
                                    flexItem sx={{ backgroundColor: "info.main" }} 
                                    orientation={isDownMd ? 'vertical' : 'horizontal'} 
                                />
                                <Typography variant="h5" color="primary" mt={isDownMd ? 0 : 1}>
                                    {settingCount[shiftType]}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </>
    )
}
