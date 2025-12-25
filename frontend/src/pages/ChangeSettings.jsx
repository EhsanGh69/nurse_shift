import { useState, useEffect, useContext } from 'react';
import { Button, TextField, CircularProgress, Backdrop, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';

import MainLayout from '../mui/MainLayout';
import AppHeader from '../components/AppHeader';
import SnackAlert from '../components/SnackAlert';
import BackButton from '../components/BackButton';
import { useChangeSettings, useCurrentSettings } from '../api/setting.api';
import handleApiErrors from '../utils/apiErrors';
import { GlobalContext } from '../context/GlobalContext';


export default function ChangeSettings() {
    const navigate = useNavigate()
    const { getData } = useContext(GlobalContext)
    const user = getData("userData")
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [settings, setSettings] = useState(null)
    const { mutateAsync, isPending } = useChangeSettings()
    const { isLoading, data } = useCurrentSettings(user?._id)

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await mutateAsync(values)
            setSnackbar({ open: true, message: 'تغییرات با موفقیت ذخیره شد', severity: 'success' })
            if (user?.role === 'MATRON' || user?.role === 'ADMIN')
                setTimeout(() => navigate('/matron'), 500)
            if (user?.role === 'NURSE')
                setTimeout(() => navigate('/nurse'), 500)
        } catch (error) {
            const msg = handleApiErrors(error);
            setSnackbar({ open: true, message: msg, severity: 'error' })
        } finally {
            setSubmitting(false)
        }
    }
    
    useEffect(() => {
        if (!isLoading && data) setSettings(data)
    }, [isLoading, data])

    return (
        <MainLayout title="تنظیمات برنامه">
            <AppHeader />
            <Backdrop open={isLoading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {settings && settings?.user === user?._id &&
                (
                    <Formik
                        initialValues={{
                            fontSize: settings.fontSize, fontFamily: settings.fontFamily,
                            themeMode: settings.themeMode
                        }}
                        onSubmit={handleSubmit}
                    >
                        {({ values, handleChange, handleBlur, errors, touched }) => (
                            <Form encType='multipart/form-data'>
                                <TextField
                                    fullWidth
                                    select
                                    label="اندازه فونت"
                                    name='fontSize'
                                    value={values.fontSize}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.fontSize && Boolean(errors.fontSize)}
                                    helperText={touched.fontSize && errors.fontSize}
                                    sx={{ mb: 2 }}
                                >
                                    {[16, 18, 20, 22, 24].map((size, index) => (
                                        <MenuItem value={size} key={index}>
                                            {size}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    fullWidth
                                    select
                                    label="نوع فونت"
                                    name='fontFamily'
                                    value={values.fontFamily}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.fontFamily && Boolean(errors.fontFamily)}
                                    helperText={touched.fontFamily && errors.fontFamily}
                                    sx={{ mb: 2 }}
                                >
                                    {['Vazir', 'Tanha', 'Parastoo'].map((font, index) => (
                                        <MenuItem value={font} key={index}>
                                            {font}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    fullWidth
                                    select
                                    label="نوع تم"
                                    name='themeMode'
                                    value={values.themeMode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.themeMode && Boolean(errors.themeMode)}
                                    helperText={touched.themeMode && errors.themeMode}
                                    sx={{ mb: 2 }}
                                >
                                    {['light', 'dark'].map((theme, index) => (
                                        <MenuItem value={theme} key={index}>
                                            {theme === 'light' ? 'روشن' : 'تیره'}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <Button
                                    fullWidth
                                    variant='contained'
                                    color='primary'
                                    type='submit'
                                    sx={{ my: 2, fontSize: 20 }}
                                    disabled={isPending}
                                >
                                    ذخیره تغییرات
                                </Button>
                                <BackButton backUrl={user?.role === 'NURSE' ? '/nurse' : '/matron'} />
                            </Form>
                        )}
                    </Formik>
                )
            }
            <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
        </MainLayout>
    )
}