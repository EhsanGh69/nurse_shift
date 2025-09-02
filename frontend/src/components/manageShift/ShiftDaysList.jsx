import { useContext, useState, useEffect } from 'react';
import { Alert, Backdrop, Box, CircularProgress, Grid, Typography } from '@mui/material'
import { ListAlt } from '@mui/icons-material'
import { Link } from 'react-router-dom';

import useShiftStore from '../../store/shiftStore';
import { useNursesShifts } from "../../api/shiftManagement.api";
import ShiftsContext from '../../context/ShiftsContext';
import { clickBox } from '../../styles/globalStyles';
import { getShiftDay } from "../../utils/shiftsData";


export default function ShiftDaysList() {
    const { shiftMonth, shiftYear } = useContext(ShiftsContext)
    const [shiftsData, setShiftsData] = useState(null)
    const { groupId } = useShiftStore()
    const { data, isLoading } = useNursesShifts(groupId, String(shiftYear), String(shiftMonth))

    const shiftDataDays = (shifts=[]) => {
        const days = []
        shifts.forEach(shift => days.push(getShiftDay(shift.shiftDay)[1]))
        return [...new Set(days)]
    }

    useEffect(() => {
        if(!isLoading && data) setShiftsData(data)
    }, [data, isLoading])

    return (
        <>
            <Backdrop open={isLoading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {shiftsData 
                ? (
                    <Grid container spacing={3} width="100%" mt={3}>
                        {shiftDataDays(shiftsData).map(shiftDataDay => (
                            <Grid
                                size={{ xs: 6, md: 4 }}
                                key={shiftDataDay}
                                sx={clickBox}
                                component={Link}
                                to={`/shifts/matron/manage/${shiftDataDay}`}
                            >
                                <Box sx={{ mb: 1 }}>
                                    <Typography variant='h6'>
                                        {shiftDataDay} / 
                                        {shiftMonth} / 
                                        {shiftYear}
                                    </Typography>
                                </Box>
                            </Grid>
                            )
                        )}
                    </Grid>
                )
                : (
                    <Alert color="error" severity="error" icon={<ListAlt fontSize="large" />}
                        sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                        <Typography variant="h5" textAlign="center">در حال حاضر شیفتی وجود ندارد</Typography>
                    </Alert>
                )
            }
        </>
    )
}
