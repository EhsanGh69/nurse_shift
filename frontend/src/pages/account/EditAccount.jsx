import { useState, useEffect } from 'react';
import { Stack, Button, TextField, CircularProgress, Backdrop} from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { editAccountSchema } from '../../validations/accountValidation';
import { centerBox } from '../../styles/globalStyles'
import SnackAlert from '../../components/SnackAlert';
import { refreshToken } from '../../utils/services';
import { useUserData } from '../../context/UserContext';
import FileInput from '../../components/FileInput';


export default function EditAccount() {
    const navigate = useNavigate()
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const { user, loading, setUser } = useUserData()

    const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
        try {
            const formData = new FormData();
            formData.append('firstName', values.firstName);
            formData.append('lastName', values.lastName);
            formData.append('mobile', values.mobile);
            if(values.avatar){
                formData.append('avatar', values.avatar)
            }
            
            const { data } = await axios.put('/account/edit', formData, 
                { withCredentials: true , headers: 'multipart/form-data'})
            setUser(data)
            setSnackbar({ open: true, message: 'تغییرات با موفقیت ذخیره شد', severity: 'success' })
            if(user?.role === 'MATRON' || user?.role === 'ADMIN')
                setTimeout(() => navigate('/matron'), 500)
            if(user?.role === 'NURSE')
                setTimeout(() => navigate('/nurse'), 500)
            resetForm()
        } catch (error) {
            console.log(error)
            const msg = error.response?.data?.error || 'خطایی رخ داد';
            if(error.status === 400)
                setFieldError('avatar', msg)
            else
                setSnackbar({ open: true, message: msg, severity: 'error' })
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        refreshToken()
    }, [])

    return (
        <MainLayout title="ویرایش حساب کاربری">
            <Stack direction='column' sx={centerBox}>
                <AppHeader />

                <Backdrop open={loading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Formik
                    initialValues={{
                        firstName: user?.firstName, lastName: user?.lastName,
                        mobile: user?.mobile, avatar: null,
                    }}
                    validationSchema={editAccountSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, errors, touched, setFieldValue }) => (
                        <Form encType='multipart/form-data'>
                            <TextField
                                fullWidth
                                label="نام"
                                name='firstName'
                                value={values.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.firstName && Boolean(errors.firstName)}
                                helperText={touched.firstName && errors.firstName}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="نام خانوادگی"
                                name='lastName'
                                value={values.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.lastName && Boolean(errors.lastName)}
                                helperText={touched.lastName && errors.lastName}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="موبایل"
                                name='mobile'
                                value={values.mobile}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.mobile && Boolean(errors.mobile)}
                                helperText={touched.mobile && errors.mobile}
                                sx={{ mb: 2 }}
                            />
                            <FileInput
                                name="avatar"
                                setFieldValue={setFieldValue}
                                formats="image/jpeg,image/png,image/jpg"
                                helper="حداکثر سایز: 200 کیلوبایت | فرمت های مجاز: jpg, png, jpeg"
                                error={errors.avatar}
                            />
                            <Button
                                fullWidth
                                variant='contained'
                                color='primary'
                                type='submit'
                                sx={{ my: 2, fontSize: 20 }}
                            >
                                ذخیره تغییرات
                            </Button>
                        </Form>
                    )}
                </Formik>

                <Button
                    fullWidth
                    variant='contained'
                    color='secondary'
                    type='button'
                    onClick={() => navigate(-1)}
                    sx={{ fontSize: 20 }}
                >
                    بازگشت
                </Button>

                <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
            </Stack>
        </MainLayout>
    )
}