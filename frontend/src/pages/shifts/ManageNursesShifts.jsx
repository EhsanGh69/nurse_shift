import { useContext, useState, useEffect } from 'react';
import { Typography, Button, Grid, Backdrop, CircularProgress, Alert, Box } from '@mui/material';
import { AddTask, Check, ListAlt, PermContactCalendar, Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";

import ShiftGroup from '../../components/shift/ShiftGroup';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import ShiftsContext from '../../context/ShiftsContext';
import { clickBox } from '../../styles/globalStyles';
import useShiftStore from '../../store/shiftStore';
import { useNursesShifts } from "../../api/shiftManagement.api";
import { useCreatePrimarySchedule } from "../../api/shiftSchedule.api";
import { useGroupDetails } from '../../api/group.api'
import SnackAlert from '../../components/SnackAlert';
import handleApiErrors from '../../utils/apiErrors';

export default function ManageNursesShifts() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const { shiftMonth, shiftYear } = useContext(ShiftsContext)
    const [shiftsData, setShiftsData] = useState(null)
    const [groupLength, setGroupLength] = useState(null)
    const [executeSchedule, setExecuteSchedule] = useState(false)
    const { groupId } = useShiftStore()
    const { data: nurseShiftsData, isLoading: nurseShiftsLoading } = useNursesShifts(groupId, String(shiftYear), String(shiftMonth))
    const { data: nurseGroupData, isLoading: nurseGroupLoading } = useGroupDetails(groupId)
    const { mutateAsync, isPending } = useCreatePrimarySchedule()

    useEffect(() => {
        if (!nurseShiftsLoading && nurseShiftsData) {
            setShiftsData(nurseShiftsData)
        }
    }, [nurseShiftsData, nurseShiftsLoading])

    useEffect(() => {
        if (!nurseGroupLoading && nurseGroupData) {
            setGroupLength(nurseGroupData.members.length + 1)
        }
    }, [nurseGroupData, nurseGroupLoading])

    useEffect(() => {
        if (shiftsData?.length && groupLength) {
            const lengthCondition = shiftsData?.length === groupLength
            const confirmedCondition = shiftsData?.every(shift => shift.confirm)
            setExecuteSchedule(lengthCondition && confirmedCondition)
        }
    }, [shiftsData, groupLength])

    const handlePrimarySchedule = async () => {
        try {
            await mutateAsync({ groupId, month: shiftMonth, year: shiftYear })
            setSnackbar({ open: true, message: 'درخواست های پرستاران با موفقیت اعمال شد', severity: 'success' })
        } catch (error) {
            const msg = handleApiErrors(error);
            setSnackbar({ open: true, message: msg, severity: 'error' })
        }
    }

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

                <Backdrop open={isPending} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                    <CircularProgress color="warning" />
                </Backdrop>
                {shiftsData?.length
                    ? (
                        <Grid container spacing={3} width="100%" mt={3}>
                            <Grid size={{ xs: 12 }}>
                                <Typography
                                    variant='h4' align='center' gutterBottom
                                    sx={{ color: isDark ? '#f5f5f5' : '#1e1e1e' }}
                                >
                                    شیفت های پرستاران
                                </Typography>
                            </Grid>
                            {executeSchedule && (
                                <Grid size={{ xs: 12 }} textAlign="center">
                                    <Button
                                        color="warning"
                                        variant="contained"
                                        sx={{ mb: 2 }}
                                        size="large"
                                        onClick={handlePrimarySchedule}
                                    >
                                        <AddTask sx={{ mr: 1 }} />
                                        <Typography variant="h6" fontSize={25}>اعمال درخواست شیفت ها</Typography>
                                    </Button>
                                </Grid>
                            )}
                            {shiftsData.map(shiftData => (
                                <Grid
                                    size={{ xs: 6, md: 4, lg: 3 }}
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
                                        {shiftData.confirm && (
                                            <Typography variant='body1' color='#14ab1bff' mt={1} fontSize={20}
                                                display="flex" alignItems="center" justifyContent="center">
                                                <Check />
                                                <span>تایید شده</span>
                                            </Typography>
                                        )}

                                    </Box>
                                </Grid>
                            ))}
                            <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
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
