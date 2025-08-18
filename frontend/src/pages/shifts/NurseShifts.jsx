import { useState, useEffect, useMemo } from "react";
import { 
    Grid, Typography, CircularProgress, Backdrop, Alert, Button, MenuItem, TextField 
} from '@mui/material';

import { EditCalendar, EventBusy } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import moment from "jalali-moment";

import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { useUserShifts } from "../../api/shift.api";
import ShiftBox from "../../components/shift/ShiftBox";
import { useUserGroups } from "../../api/group.api";
import ShiftsFilter from "../../components/shift/ShiftsFilter";


export default function NurseShifts() {
    const today = moment()
    const shiftMonth = useMemo(() => today.jMonth() + 2 > 12 ? 1 : today.jMonth() + 2)
    const shiftYear = useMemo(() => shiftMonth > 12 ? today.jYear() + 1 : today.jYear())
    const [userShifts, setUserShifts] = useState(null)
    const [shiftMonthCount, setShiftMonthCount] = useState(null)
    const [allShiftsCount, setAllShiftsCount] = useState(null)
    const [groupsCount, setGroupsCount] = useState(0)
    const { data: userGroups, isLoading: groupsLoading } = useUserGroups()
    const [selectedYear, setSelectedYear] = useState(shiftYear)
    const [selectedMonth, setSelectedMonth] = useState('')
    const { data, isLoading } = useUserShifts(selectedYear, selectedMonth)

    useEffect(() => {
        if (data && !isLoading){
            setUserShifts(data.shifts)
            setShiftMonthCount(data.monthCount)
            setAllShiftsCount(data.totalCount)
        }
    }, [data, isLoading])

    useEffect(() => {
        if (userGroups && !groupsLoading)
            setGroupsCount(userGroups.length)
    }, [userGroups, groupsLoading])

    const checkCurrentMonthShift = () => {
        if(groupsCount > 0 && shiftMonthCount && groupsCount === shiftMonthCount)
            return false
        else
            return true
    }

    return (
        <MainLayout title="شیفت های پرستار">
            <AppHeader />
            <Grid container width="100%">
                <Backdrop open={isLoading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                {checkCurrentMonthShift() && (
                    <Grid size={{ xs: 12 }}>
                        <Button
                        color="success"
                        variant="contained"
                        sx={{ mb: 2 }}
                        LinkComponent={Link}
                        size="large"
                        to="/shifts/create"
                        >
                            <EditCalendar sx={{ mr: 1 }} />
                            <Typography variant="h6">ایجاد شیفت جدید</Typography>
                        </Button>
                    </Grid>
                )}

                {allShiftsCount && (
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

