import { useState, useEffect } from 'react';
import { Grid, Button, TextField } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';

import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { changePasswordSchema } from '../../validations/accountValidation';
import SnackAlert from '../../components/SnackAlert';
import BackButton from '../../components/BackButton';
import { useChangePassword } from '../../api/account.api';
import { useCurrentUser } from '../../api/auth.api'
import handleApiErrors from '../../utils/apiErrors';


export default function ChangePassword() {
    const navigate = useNavigate()
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [user, setUser] = useState(null)
    const { mutateAsync, isPending } = useChangePassword()
    const { data, isLoading } = useCurrentUser()

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await mutateAsync(values)
            setSnackbar({ open: true, message: 'رمز عبور شما با موفقیت تغییر یافت', severity: 'success' })
            setTimeout(() => {
                if (user?.role === 'NURSE') navigate('/nurse')
                else navigate('/matron')
            }, 500)
            resetForm()
        } catch (error) {
            const msg = handleApiErrors(error)
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
        <MainLayout title="تغییر رمز عبور">
            <AppHeader />
            <Grid height="100vh" display="flex" flexDirection="column"
                size={{ xs: 12, sm: 8, md: 6, xl: 5 }}
            >
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
                                disabled={isPending}
                            >
                                تغییر رمز عبور
                            </Button>
                            <BackButton backUrl={user?.role === 'NURSE' ? '/nurse' : '/matron'} />
                        </Form>
                    )}
                </Formik>

                <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
            </Grid>
        </MainLayout>
    )
}
