import { useState, useEffect } from 'react';
import { Button, TextField, CircularProgress, Backdrop } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';

import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { editAccountSchema } from '../../validations/accountValidation';
import SnackAlert from '../../components/SnackAlert';
import FileInput from '../../components/FileInput';
import { useCurrentUser } from '../../api/auth.api';
import { useEditAccount } from '../../api/account.api';
import handleApiErrors from '../../utils/apiErrors';
import BackButton from '../../components/BackButton';


export default function EditAccount() {
    const navigate = useNavigate()
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [user, setUser] = useState(null)
    const { data, isLoading } = useCurrentUser()
    const { mutateAsync, isPending } = useEditAccount()

    const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
        try {
            const formData = new FormData();
            formData.append('firstName', values.firstName);
            formData.append('lastName', values.lastName);
            formData.append('mobile', values.mobile);
            if (values.avatar) {
                formData.append('avatar', values.avatar)
            }
            await mutateAsync(formData)
            setSnackbar({ open: true, message: 'تغییرات با موفقیت ذخیره شد', severity: 'success' })
            if (user?.role === 'MATRON' || user?.role === 'ADMIN')
                setTimeout(() => navigate('/matron'), 500)
            if (user?.role === 'NURSE')
                setTimeout(() => navigate('/nurse'), 500)
            resetForm()
        } catch (error) {
            const msg = handleApiErrors(error);
            if (error.status === 400)
                setFieldError('avatar', msg)
            else
                setSnackbar({ open: true, message: msg, severity: 'error' })
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        if (!isLoading && data)
            setUser(data)
    }, [data, isLoading])

    return (
        <MainLayout title="ویرایش حساب کاربری">
            <AppHeader />
            <Backdrop open={isLoading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {user &&
                 (
                    <Formik
                        initialValues={{
                            firstName: user.firstName, lastName: user.lastName,
                            mobile: user.mobile, avatar: null,
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
                                    user={{ id: user._id, avatar: user.avatar}}
                                />
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
                                <BackButton backUrl={user.role === 'NURSE' ? '/nurse' : '/matron'} />
                            </Form>
                        )}
                    </Formik>
                )
            }
            <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
        </MainLayout>
    )
}