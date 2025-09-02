import { useState, useEffect, useContext } from "react";
import { 
    Grid, Typography, CircularProgress, Backdrop, Alert, Button
} from '@mui/material';

import { EditCalendar, EventBusy, PermContactCalendar } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { useUserShifts } from "../../api/shift.api";
import ShiftBox from "../../components/shift/ShiftBox";
import ShiftsFilter from "../../components/shift/ShiftsFilter";
import { GlobalContext } from "../../context/GlobalContext";
import ShiftGroup from "../../components/shift/ShiftGroup";
import useShiftStore from '../../store/shiftStore';
import ShiftsContext from "../../context/ShiftsContext";


export default function NurseShifts() {
    const { shiftYear } = useContext(ShiftsContext)
    const [userShifts, setUserShifts] = useState(null)
    const [selectedYear, setSelectedYear] = useState(shiftYear)
    const [selectedMonth, setSelectedMonth] = useState('')
    const [haveShiftMonth, setHaveShiftMonth] = useState(null)
    const { groupId } = useShiftStore()
    const { data, isLoading } = useUserShifts(groupId, selectedYear, selectedMonth)
    const { getData } = useContext(GlobalContext)
    const user = getData("userData")

    useEffect(() => {
        if (data && !isLoading){
            setUserShifts(data.shifts)
            setHaveShiftMonth(data.haveShift)
        }
    }, [data, isLoading])

    useEffect(() => {
        if(haveShiftMonth !== null) useShiftStore.getState().setParams({ haveShift: haveShiftMonth })
    }, [haveShiftMonth])


    return (
        <MainLayout title="شیفت های پرستار">
            <AppHeader />
            <Grid container width="100%">
                <Backdrop open={isLoading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Grid size={{ xs: 12 }}>
                    {(!haveShiftMonth && !!groupId) && (
                        <Button
                            color="success"
                            variant="contained"
                            sx={{ mb: 2, mr: 2 }}
                            LinkComponent={Link}
                            size="large"
                            to="/shifts/create"
                            >
                                <EditCalendar sx={{ mr: 1 }} />
                                <Typography variant="h6">ایجاد شیفت جدید</Typography>
                        </Button>
                    )}

                    {user?.role === 'MATRON' && (
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
                    )}
                </Grid>
                
                <ShiftGroup />

                {haveShiftMonth && (
                    <ShiftsFilter
                        selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                        selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
                        shiftYear={shiftYear}
                    />
                )}

                {userShifts?.length
                    ? userShifts.map((shift, index) => <ShiftBox shift={shift} key={index} />)
                    : (
                        <Alert color="error" severity="error" icon={<EventBusy fontSize="large" />}
                            sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <Typography variant="h5" textAlign="center">شیفتی وجود ندارد</Typography>
                        </Alert>
                    )
                }
            </Grid>
        </MainLayout>
    )
}

