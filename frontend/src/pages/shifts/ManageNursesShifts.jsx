import { useContext, useState, useEffect } from 'react';
import { Typography, Button, Grid, Backdrop, CircularProgress, Alert, Box } from '@mui/material';
import { Link } from 'react-router-dom';

import ShiftGroup from '../../components/shift/ShiftGroup';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { ListAlt, PermContactCalendar } from '@mui/icons-material';
import ShiftsContext from '../../context/ShiftsContext';
import { clickBox } from '../../styles/globalStyles';
import { getShiftDay } from "../../utils/shiftsData";
import useShiftStore from '../../store/shiftStore';
import { useNursesShifts } from "../../api/shiftManagement.api";


export default function ManageNursesShifts() {
    const { shiftMonth, shiftYear } = useContext(ShiftsContext)
    const [shiftsData, setShiftsData] = useState(null)
    const { groupId } = useShiftStore()
    const { data, isLoading } = useNursesShifts(groupId, String(shiftYear), String(shiftMonth))

    const shiftDataDays = (shifts=[]) => {
        const days = []
        shifts.forEach(shift => days.push(getShiftDay(shift.shiftDay)[1]))
        return [...new Set(days)].sort((a, b) => a - b)
    }

    useEffect(() => {
        if(!isLoading && data) setShiftsData(data)
    }, [data, isLoading])
    

  return (
    <MainLayout title="شیفت های پرستاران">
        <AppHeader />
        <Grid container width="100%">
            <Grid size={{ xs: 12 }}>
                <Button
                    color="info"
                    variant="contained"
                    sx={{ mb: 2 }}
                    LinkComponent={Link}
                    size="large"
                    to="/shifts/matron"
                    >
                        <PermContactCalendar sx={{ mr: 1 }} />
                        <Typography variant="h6">بازگشت به مدیریت شیفت ها</Typography>
                </Button>
            </Grid>
            
            <ShiftGroup />

            <Backdrop open={isLoading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {shiftsData?.length
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
                        sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2 }}>
                        <Typography variant="h5" textAlign="center">در حال حاضر شیفتی وجود ندارد</Typography>
                    </Alert>
                )
            }
            
        </Grid>
    </MainLayout>
  )
}
