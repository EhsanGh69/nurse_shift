import { useState, useEffect, useMemo } from 'react';
import { Typography, Button, Backdrop, CircularProgress, Grid, Paper } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { PermContactCalendar } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import ShiftGroup from '../../components/shift/ShiftGroup';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import SnackAlert from '../../components/SnackAlert';
import useShiftStore from '../../store/shiftStore';
import { useShiftSettings, useSetShiftSettings } from '../../api/shiftManagement.api';
import { personShifts, hourShifts } from '../../constants/shifts';
import SettingBox from '../../components/manageShift/SettingBox';
import DayLimitBox from '../../components/manageShift/DayLimitBox';
import { personCountSchema, hourCountSchema, dayLimitSchema } from "../../validations/shiftSettingsValidation";
import handleApiErrors from '../../utils/apiErrors';


export default function ShiftSettings() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const navigate = useNavigate()
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const initialPersonCount = useMemo(() => ({ M: 1, E: 1, N: 1, MH: 1, EH: 1, NH: 1 }))
    const initialHourCount = useMemo(() => ({ NPM: 1, NPE: 1, NPN: 1, PM: 1, PE: 1, PN: 1, V: 1 }))
    const [personCount, setPersonCount] = useState({ ...initialPersonCount })
    const [hourCount, setHourCount] = useState({ ...initialHourCount })
    const [dayLimit, setDayLimit] = useState(1)
    const { groupId } = useShiftStore()
    const { isLoading, data, isError, error } = useShiftSettings(groupId)
    const { mutateAsync, isPending } = useSetShiftSettings()

    const handlePersonCount = (shift, count) => setPersonCount(prev => ({ ...prev, [shift]: count }))
    
    const handleHourCount = (shift, count) => setHourCount(prev => ({ ...prev, [shift]: count }))
    
    const handleDayLimit = (limit) => setDayLimit(limit)
    
    const handleSetSettings = async () => {
        try{
            await personCountSchema(personShifts).validate(personCount)
            await hourCountSchema(hourShifts).validate(hourCount)
            await dayLimitSchema.validate(dayLimit)
            await mutateAsync({ groupId, personCount, hourCount, dayLimit })
            setSnackbar({ open: true, message: 'تغییرات با موفقیت ذخیره شد', severity: 'success' })
            setTimeout(() => navigate('/shifts/matron'), 500)
        }catch(error) {
            if(error instanceof Yup.ValidationError){
                if(personShifts.includes(error.path))
                    setSnackbar({ open: true, message: "تعداد افراد وارد شده نامعتبر می باشد", severity: 'error' })
                else if(hourShifts.includes(error.path))
                   setSnackbar({ open: true, message: "مقدار ساعت وارد شده نامعتبر می باشد", severity: 'error' })
                else
                   setSnackbar({ open: true, message: "مهلت ارسال وارد شده نامعتبر می باشد", severity: 'error' })  
            }else {
                const msg = handleApiErrors(error);
                setSnackbar({ open: true, message: msg, severity: 'error' })
            }
        }
        
    }

    useEffect(() => {
        if (!isLoading && data) {
            setPersonCount(prev => ({ ...prev, ...data?.personCount }))
            setHourCount(prev => ({ ...prev, ...data?.hourCount }))
            setDayLimit(data?.dayLimit)
        }else if(isError && error?.status === 404) {
            setPersonCount({ ...initialPersonCount })
            setHourCount({ ...initialHourCount })
            setDayLimit(1)
        }
    }, [isLoading, data, isError, error])

    return (
        <MainLayout title="تنظیمات شیفت">
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

                {groupId && (
                    <>
                        <Backdrop open={isLoading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        <Grid size={{ xs: 12 }}>
                            <Typography
                                variant='h4' align='center' gutterBottom
                                sx={{ color: isDark ? '#f5f5f5' : '#1e1e1e' }}
                            >
                                تنظیمات شیفت
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Paper
                                elevation={3}
                                sx={{ p: 2, border: '2px solid #1976d2' }}
                            >
                                <Typography
                                    variant='h6'
                                    color='warning'
                                    sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                                    M: صبح | E: عصر | N: شب | H: تعطیل | V: مرخصی
                                </Typography>
                            </Paper>
                        </Grid>

                        <SettingBox
                            title="چیدمان افراد"
                            shiftKeys={personShifts}
                            handleChangeCount={handlePersonCount}
                            limitCount={100}
                            inputValue={personCount}
                        />
                        <SettingBox
                            title="چیدمان ساعت"
                            shiftKeys={hourShifts}
                            handleChangeCount={handleHourCount}
                            limitCount={24}
                            inputValue={hourCount}
                        />

                        <DayLimitBox dayLimit={dayLimit} handleDayLimit={handleDayLimit} />

                        <Grid size={{ xs: 12 }} textAlign="center" mt={2}>
                            <Button variant='contained' color='success'
                                sx={{ fontSize: 30, color: "#0e0e0e", px: 5 }}
                                disabled={isPending}
                                onClick={handleSetSettings}
                            >
                                ذخیره تغییرات
                            </Button>
                        </Grid>

                        <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
                    </>
                )}
            </Grid>
        </MainLayout>
    )
}
