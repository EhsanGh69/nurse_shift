import { useState, useEffect } from 'react';
import { Stack, Button, TextField } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { changePasswordSchema } from '../../validations/accountValidation';
import { centerBox } from '../../styles/globalStyles'
import SnackAlert from '../../components/SnackAlert';
import { refreshToken } from '../../utils/services';


export default function ChangePassword() {
    const navigate = useNavigate()
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await axios.post('/account/change_password', values, { withCredentials: true })
            setSnackbar({ open: true, message: 'رمز عبور شما با موفقیت تغییر یافت', severity: 'success' })
            setTimeout(() => navigate('/nurse'), 1000)
            resetForm()
        } catch (error) {
            console.log(error)
            const msg = error.response?.data?.message || 'خطایی رخ داد';
            setSnackbar({ open: true, message: msg, severity: 'error' })
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        refreshToken(navigate)
    }, [])

    return (
        <MainLayout title="تغییر رمز عبور">
            <Stack direction='column' sx={centerBox}>
                <AppHeader />

                <Formik
                    initialValues={{
                        oldPassword: "", newPassword: ""
                    }}
                    validationSchema={changePasswordSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, errors, touched }) => (
                        <Form>
                            <TextField
                                fullWidth
                                label="رمز عبور کنونی"
                                name='oldPassword'
                                type='password'
                                value={values.oldPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.oldPassword && Boolean(errors.oldPassword)}
                                helperText={touched.oldPassword && errors.oldPassword}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="رمز عبور جدید"
                                name='newPassword'
                                type='password'
                                value={values.newPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.newPassword && Boolean(errors.newPassword)}
                                helperText={touched.newPassword && errors.newPassword}
                                sx={{ mb: 2 }}
                            />
                            <Button
                                fullWidth
                                variant='contained'
                                color='primary'
                                type='submit'
                                sx={{ mb: 2, fontSize: 20 }}
                            >
                                تغییر رمز عبور
                            </Button>
                        </Form>
                    )}
                </Formik>

                <Button
                    fullWidth
                    variant='contained'
                    color='secondary'
                    type='button'
                    onClick={() => navigate(-2)}
                    sx={{ fontSize: 20 }}
                >
                    بازگشت
                </Button>

                <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
            </Stack>
        </MainLayout>
    )
}
