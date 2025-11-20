import { useContext, useState, useEffect } from 'react';
import { Typography, Button, Grid, Backdrop, CircularProgress, Alert, Box } from '@mui/material';
import { ListAlt, PermContactCalendar, Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import ShiftGroup from '../../components/shift/ShiftGroup';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import ShiftsContext from '../../context/ShiftsContext';
import { clickBox } from '../../styles/globalStyles';
import useShiftStore from '../../store/shiftStore';
import { useNursesShifts } from "../../api/shiftManagement.api";


export default function ManageNursesShifts() {
    const { shiftMonth, shiftYear } = useContext(ShiftsContext)
    const [shiftsData, setShiftsData] = useState(null)
    const { groupId } = useShiftStore()
    const { data, isLoading } = useNursesShifts(groupId, String(shiftYear), String(shiftMonth))

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
                        {shiftsData.map(shiftData => (
                            <Grid
                                size={{ xs: 6, md: 4 }}
                                key={shiftData.shiftId}
                                sx={clickBox}
                                component={Link}
                                to={`/shifts/matron/manage/${shiftData.shiftId}`}
                            >
                                <Box sx={{ mb: 1 }}>
                                    <Person fontSize='large' />
                                    <Typography variant='h6'>
                                        {shiftData.fullname}
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
                        <Typography variant="h5" textAlign="center">در حال حاضر هیچ درخواست شیفتی وجود ندارد</Typography>
                    </Alert>
                )
            }
            
        </Grid>
    </MainLayout>
  )
}
