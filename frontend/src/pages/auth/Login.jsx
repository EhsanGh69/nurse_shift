import { useState } from 'react';
import { Button, TextField, Typography, Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query'

import MainLayout from '../../mui/MainLayout';
import { loginSchema } from '../../validations/authValidation'
import SnackAlert from '../../components/SnackAlert';
import { useLogin } from '../../api/auth.api';
import handleApiErrors from '../../utils/apiErrors';
import BackButton from '../../components/BackButton';
import { textFieldStyle } from '../../styles/globalStyles';


export default function Login() {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const { mutateAsync, isPending } = useLogin()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const preferDark = useMediaQuery('(prefers-color-scheme: dark)')

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const result = await mutateAsync(values)
            setSnackbar({ open: true, message: "با موفقیت وارد شدید", severity: 'success' })
            setTimeout(async () => {
                await queryClient.refetchQueries({ queryKey: ['currentUser'] })
                await queryClient.resetQueries({ queryKey: ['currentSettings'] })
                if (result.role === 'NURSE') navigate('/nurse')
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

    return (
        <MainLayout title="ورود">
            <Grid height="100vh" display="flex" flexDirection="column" justifyContent="center"
                size={{ xs: 12, sm: 8, md: 6, xl: 5 }}
            >
                <Typography
                    variant='h4' align='center' gutterBottom
                    sx={{ color: preferDark ? '#f5f5f5' : '#1e1e1e' }}
                >
                    ورود اعضاء
                </Typography>

                <Formik
                    initialValues={{
                        username: "", password: ""
                    }}
                    validationSchema={loginSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, errors, touched }) => (
                        <Form>
                            <TextField
                                fullWidth
                                variant='outlined'
                                label="نام کاربری"
                                name='username'
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.username && Boolean(errors.username)}
                                helperText={touched.username && errors.username}
                                sx={{ mb: 2, ...textFieldStyle(preferDark) }}
                            />
                            <TextField
                                fullWidth
                                label="رمز عبور"
                                name='password'
                                type='password'
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                sx={{ mb: 2, ...textFieldStyle(preferDark) }}
                            />
                            <Button
                                fullWidth
                                variant='contained'
                                color='primary'
                                type='submit'
                                sx={{ mb: 2, fontSize: 20 }}
                                disabled={isPending}
                            >
                                ورود
                            </Button>
                            <BackButton backUrl='/' />
                        </Form>
                    )}
                </Formik>
            </Grid>
            <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
        </MainLayout>
    )
}
