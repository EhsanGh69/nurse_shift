import { useState, useEffect, useContext } from 'react'
import { Backdrop, Button, CircularProgress, Grid, Typography, useMediaQuery, Drawer } from '@mui/material'
import { useTheme } from "@mui/material/styles";
import { EventNote } from '@mui/icons-material'
import { useParams, useNavigate, Link } from 'react-router-dom'

import MainLayout from '../../mui/MainLayout'
import AppHeader from '../../components/AppHeader'
import { useNursesShifts } from "../../api/shiftManagement.api";
import RejectModal from '../../components/manageShift/RejectModal';
import ChangeModal from '../../components/manageShift/ChangeModal';
import useShiftStore from '../../store/shiftStore';
import ShiftsContext from '../../context/ShiftsContext';
import ShiftDataBox from '../../components/manageShift/ShiftDataBox';
import ShiftsCountBox from '../../components/manageShift/ShiftsCountBox';
import SnackAlert from '../../components/SnackAlert';


export default function NurseDayShifts() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const isDownLg = useMediaQuery(theme.breakpoints.down('lg'))
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [dayShifts, setDayShifts] = useState(null)
    const [selectedShift, setSelectedShift] = useState({ shiftId: '', shiftDay: '', shiftUser: '' })
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [changeModalOpen, setChangeModalOpen] = useState(false)
    const [rejectModalOpen, setRejectModalOpen] = useState(false)
    const [rejectModalMsg, setRejectModalMsg] = useState(null)
    const { groupId, groupTitle } = useShiftStore()
    const { shiftMonth, shiftYear } = useContext(ShiftsContext)
    const { data, isLoading } = useNursesShifts(groupId, String(shiftYear), String(shiftMonth))
    const { day } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if(!isLoading && data){
            const filterData = data.filter(item => item.shiftDay.includes(day))
            if(!!filterData.length) setDayShifts(filterData)
            else navigate('/shifts/matron/manage')
        }
    }, [data, isLoading])

    return (
        <MainLayout title={`شیفت های ${shiftYear}/${shiftMonth}/${day}`}>
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
                        to="/shifts/matron/manage"
                        >
                            <EventNote sx={{ mr: 1 }} />
                            <Typography variant="h6">بازگشت به شیفت های پرستاران</Typography>
                    </Button>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Typography
                        variant='h4' align='center' gutterBottom
                        sx={{ color: isDark ? '#f5f5f5' : '#1e1e1e' }}
                    >
                        {day} / {shiftMonth} / {shiftYear}
                    </Typography>
                    <Typography
                        variant='h5' align='center' gutterBottom
                        sx={{ color: isDark ? '#f5f5f5' : '#1e1e1e' }}
                    >
                        {groupTitle}
                    </Typography>
                </Grid>

                {dayShifts && (
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
                                            <ShiftsCountBox dayShifts={dayShifts} />
                                        </Drawer>
                                    </>
                                )
                                : <ShiftsCountBox dayShifts={dayShifts} />
                            }
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            {dayShifts.map(dayShift => (
                                <ShiftDataBox
                                    key={dayShift.shiftDay}
                                    shiftData={dayShift}
                                    setRejectModalMsg={setRejectModalMsg}
                                    setRejectModalOpen={setRejectModalOpen}
                                    setSelectedShift={setSelectedShift}
                                    setChangeModalOpen={setChangeModalOpen}
                                />
                            ))}
                        </Grid>
                    </>
                )}
            </Grid>
            <RejectModal 
                open={rejectModalOpen} msg={rejectModalMsg} 
                closeHandler={() => setRejectModalOpen(false)}
                selectedShift={selectedShift}
            />
            <ChangeModal 
                open={changeModalOpen}
                setChangeModalOpen={setChangeModalOpen}
                setSnackbar={setSnackbar}
                selectedShift={selectedShift}
            />
            <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
        </MainLayout>
    )
}
