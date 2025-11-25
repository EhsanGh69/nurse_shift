import { useState, useEffect, useContext } from 'react'
import { Backdrop, Button, CircularProgress, Grid, Typography, Paper } from '@mui/material'
import { useTheme } from "@mui/material/styles";
import { EventNote, Warning, LockOutline, LockOpen } from '@mui/icons-material'
import { useParams, useNavigate, Link } from 'react-router-dom'

import MainLayout from '../../mui/MainLayout'
import AppHeader from '../../components/AppHeader'
import { useNursesShifts } from "../../api/shiftManagement.api";
import RejectModal from '../../components/manageShift/RejectModal';
import EditShiftModal from '../../components/manageShift/EditShiftModal';
import ChangeTemporalModal from '../../components/manageShift/ChangeTemporalModal';
import useShiftStore from '../../store/shiftStore';
import ShiftsContext from '../../context/ShiftsContext';
import ShiftDataBox from '../../components/manageShift/ShiftDataBox';
import SnackAlert from '../../components/SnackAlert';


export default function NurseDayShifts() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [nurseShifts, setNurseShifts] = useState(null)
    const [selectedShift, setSelectedShift] = useState({ shiftId: '', shiftDay: '', shiftUser: '' })
    const [temporalModalOpen, setTemporalModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [rejectModalOpen, setRejectModalOpen] = useState(false)
    const { groupId, groupTitle } = useShiftStore()
    const { shiftMonth, shiftYear } = useContext(ShiftsContext)
    const { data, isLoading } = useNursesShifts(groupId, String(shiftYear), String(shiftMonth))
    const { shiftId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if(!isLoading && data){
            const shiftData = data.find(item => item.shiftId === shiftId)
            if(!!shiftData) setNurseShifts(shiftData)
            else navigate('/shifts/matron/manage')
        }
    }, [data, isLoading])

    const handleSelectShift = (dayShift) => {
        setSelectedShift({
            shiftId,
            shiftDay: `${dayShift[1]}${dayShift[0]}`,
            shiftUser: nurseShifts?.fullname
        });
    };

    return (
        <MainLayout title={`شیفت های درخواست شده`}>
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
                        variant='h5' align='center' gutterBottom
                        sx={{ color: isDark ? '#f5f5f5' : '#1e1e1e' }}
                    >
                        {groupTitle}
                    </Typography>
                    <Typography
                        variant='h4' align='center' gutterBottom
                        sx={{ color: isDark ? '#f5f5f5' : '#1e1e1e' }}
                    >
                        {nurseShifts?.fullname}
                    </Typography>
                </Grid>

                {nurseShifts && (
                    <>
                        {nurseShifts.temporal && (
                            <Grid size={{ xs: 12 }} mt={1}>
                                <Paper
                                    elevation={3}
                                    sx={{ p: 2, border: '2px solid #1976d2' }}
                                >
                                    <Typography
                                        variant='h6'
                                        color='error'
                                        sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Warning fontSize='large'/>
                                            <span>
                                                <b>توجه : </b>
                                                ویرایش پرستار فعال می باشد. امکان رد یا تغییر شیفت وجود ندارد.   
                                            </span>
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}
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

                        <Grid size={{ xs: 12 }}>
                            <ShiftDataBox
                                nurseShifts={nurseShifts}
                                handleSelectShift={handleSelectShift}
                                setRejectModalOpen={setRejectModalOpen}
                                setEditModalOpen={setEditModalOpen}
                            />
                        </Grid>
                    </>
                )}

                <Grid size={{ xs: 12 }}>
                    <Button 
                        color={nurseShifts?.temporal ? "warning" : "secondary"}
                        variant="contained"
                        sx={{ mt: 2, fontSize: "1.3rem" }}
                        size="large"
                        onClick={() => setTemporalModalOpen(true)}
                    >
                        {nurseShifts?.temporal 
                            ? (
                                <span style={{ display: "flex", alignItems: "center" }}> 
                                    <LockOpen />
                                    <span>غیرفعال سازی ویرایش پرستار</span>
                                </span>
                            )
                            : (
                                <span style={{ display: "flex", alignItems: "center" }}> 
                                    <LockOutline />
                                    <span>فعال سازی ویرایش پرستار</span>
                                </span>
                            )
                        }
                    </Button>
                </Grid>
            </Grid>
            <ChangeTemporalModal 
                open={temporalModalOpen}
                closeHandler={() => setTemporalModalOpen(false)}
                shiftId={shiftId}
                temporal={nurseShifts?.temporal}
                setSnackbar={setSnackbar}
            />
            <RejectModal 
                open={rejectModalOpen}
                closeHandler={() => setRejectModalOpen(false)}
                selectedShift={selectedShift}
            />
            <EditShiftModal 
                open={editModalOpen}
                setEditModalOpen={setEditModalOpen}
                setSnackbar={setSnackbar}
                selectedShift={selectedShift}
            />
            <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
        </MainLayout>
    )
}
