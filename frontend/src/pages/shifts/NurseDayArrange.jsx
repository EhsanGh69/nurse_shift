import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
    Alert, Backdrop, Button, CircularProgress, Grid, Paper, Typography, useTheme, useMediaQuery, Drawer 
} from '@mui/material';
import { EventBusy, EventNote, PersonOff } from '@mui/icons-material';
import moment from "jalali-moment";

import { useShiftSchedule } from "../../api/shiftSchedule.api";
import SnackAlert from '../../components/SnackAlert';
import useShiftStore from '../../store/shiftStore';
import ShiftsContext from '../../context/ShiftsContext';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import ShiftArrangeBox from '../../components/schedule/shiftArrangeBox';
import ShiftsCountBox from '../../components/manageShift/ShiftsCountBox';
import EditNurseShiftModal from '../../components/schedule/EditNurseShiftModal';


export default function NurseDayArrange() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const isDownLg = useMediaQuery(theme.breakpoints.down('lg'))
    const { shiftMonth, shiftYear, checkHoliday } = useContext(ShiftsContext)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [nurseSchedule, setNurseSchedule] = useState(null)
    const [needManagers, setNeedManagers] = useState(null)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedNurse, setSelectedNurse] = useState({ nurseId: '', nurseName: '', shiftDay: '', shiftType: '' })
    const { groupId, groupTitle } = useShiftStore()
    const { day } = useParams()
    const { data, isLoading, isError, error } = useShiftSchedule(groupId, day)
    const navigate = useNavigate()

    useEffect(() => {
        if(!isLoading && isError && error.status === 404)
            navigate('/404', { state: { backTo: "/shifts/matron/arrange" } })
        else if(!isLoading && data) {
            setNurseSchedule(data.shiftDaySchedule)
            setNeedManagers(data.nonShiftManagers)
        }
    }, [isLoading, data, isError, error])

    const handleSelectNurse = (nurseId, nurseName, shiftType) => {
        setSelectedNurse({
            shiftDay: day,
            nurseId,
            nurseName,
            shiftType
        })
    }

    const setDayColor = (day) => {
        const weekDay = moment(`${shiftYear}/${shiftMonth}/${day}`, 'jYYYY/jM/jD').locale("fa").weekday()
        if(checkHoliday(day) || weekDay === 6) return "red"
        return isDark ? '#f5f5f5' : '#1e1e1e'
    }

  return (
    <MainLayout title="چینش روزانه پرستارن">
            <AppHeader />
            <Backdrop open={isLoading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container width="100%">
                <Grid size={{ xs: 12 }}>
                    <Button
                        color="info"
                        variant="contained"
                        sx={{ mb: 2 }}
                        LinkComponent={Link}
                        size="large"
                        to="/shifts/matron/arrange"
                        >
                            <EventNote sx={{ mr: 1 }} />
                            <Typography variant="h6">بازگشت به چینش پرستاران</Typography>
                    </Button>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Typography
                        variant='h5' align='center' gutterBottom
                        sx={{ color: isDark ? '#f5f5f5' : '#1e1e1e' }}
                    >
                        {groupTitle}
                    </Typography>
                    <Typography
                        variant='h4' align='center' gutterBottom
                        sx={{ color: setDayColor(Number(day)) }}
                    >
                        {`${shiftYear}/${shiftMonth}/${day}`}
                    </Typography>
                </Grid>

                {(nurseSchedule && !!Object.keys(nurseSchedule).length)
                    ? (
                        <>
                        
                            <Grid 
                                width="100%"
                                display="flex" justifyContent="space-between"
                                flexDirection={{ xs: 'column', md: 'row' }}
                                position="sticky"
                                top={-50}
                                zIndex={1000}
                                bgcolor={isDark ? "#373434" : "#d3d3d3"}
                            >
                                {isDownLg
                                    ? (
                                        <>
                                            <Grid size={{ xs: 12 }} display="flex" justifyContent="space-around" mt={2} p={2}>
                                                <Button onClick={() => setDrawerOpen(true)}
                                                    variant='contained' color='primary' sx={{ p: 2, fontSize: 20 }}>
                                                    آمار درخواست ها - چیدمان شیفت ها
                                                </Button>
                                            </Grid>
                                            <Drawer anchor='top' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                                                <ShiftsCountBox shiftDaySchedule={nurseSchedule} />
                                            </Drawer>
                                        </>
                                    )
                                    : <ShiftsCountBox shiftDaySchedule={nurseSchedule} />
                                } 
                            </Grid>
                       

                            <Grid size={{ xs: 12 }} mt={1}>
                                <Paper
                                    elevation={3}
                                    sx={{ p: 2, border: '2px solid #1976d2' }}
                                >
                                    <Typography
                                        variant='h6'
                                        color='warning'
                                        sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                                        M: صبح | E: عصر | N: شب | V: مرخصی | H: تعطیل | OFF: بدون شیفت
                                    </Typography>
                                </Paper>
                            </Grid>

                            {(!!needManagers && !!needManagers.length) && (
                                <Alert color="warning" severity="warning" icon={<PersonOff fontSize="large" />}
                                    sx={{ width: "100%", mt: 2 }}>
                                    <Typography variant="h6">
                                        {needManagers.length > 1
                                            ? (
                                                <span>
                                                    برای شیفت های 
                                                    {needManagers[0]} و {needManagers[1]} 
                                                    مسئول شیفت وجود ندارد
                                                </span>
                                            )
                                            : (
                                                <span>
                                                    برای شیفت {" "}
                                                    {needManagers[0]} {" "}
                                                    مسئول شیفت وجود ندارد
                                                </span>
                                            )
                                        }
                                    </Typography>
                                </Alert>
                            )}

                            <Grid size={{ xs: 12 }}>
                                <ShiftArrangeBox
                                    shiftsSchedule={nurseSchedule}
                                    handleSelectNurse={handleSelectNurse}
                                    setEditModalOpen={setEditModalOpen}
                                />
                            </Grid>
                        </>
                    )
                    : (
                        <Alert color="error" severity="error" icon={<EventBusy fontSize="large" />}
                            sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2 }}>
                            <Typography variant="h5" textAlign="center">برای این روز هیچ شیفتی وجود ندارد</Typography>
                        </Alert>
                    )
                }
            </Grid>
            <EditNurseShiftModal 
                open={editModalOpen}
                setEditModalOpen={setEditModalOpen}
                selectedNurse={selectedNurse}
                setSnackbar={setSnackbar}
            />
            <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
        </MainLayout>
  )
}
