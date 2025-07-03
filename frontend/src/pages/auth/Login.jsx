import { useState, useEffect } from 'react';
import { Stack, Button, TextField, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import MainLayout from '../../mui/MainLayout';
import { loginSchema } from '../../validations/authValidation'
import { centerBox } from '../../styles/globalStyles'
import SnackAlert from '../../components/SnackAlert';
import { userNavigate } from '../../utils/services'


export default function Login() {
    const navigate = useNavigate()
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const { data } = await axios.post('/auth/login', values, {withCredentials: true})
            setSnackbar({ open: true, message: 'با موفقیت وارد شدید', severity: 'success' })
            if(data.role === 'NURSE')
                setTimeout(() => navigate('/nurse'), 1000)
            else
                setTimeout(() => navigate('/matron'), 1000)
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
        userNavigate(navigate)
    }, [])

    return (
        <MainLayout title="ورود">
            <Stack direction='column' justifyContent='center' sx={centerBox}>
                <Typography variant='h4' align='center' gutterBottom>
                    ورود اعضاء
                </Typography>

                <Formik
                    initialValues={{
                        nationalCode: "", password: ""
                    }}
                    validationSchema={loginSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, errors, touched }) => (
                        <Form>
                            <TextField
                                fullWidth
                                label="کد ملی"
                                name='nationalCode'
                                value={values.nationalCode}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.nationalCode && Boolean(errors.nationalCode)}
                                helperText={touched.nationalCode && errors.nationalCode}
                                sx={{ mb: 2 }}
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
                                sx={{ mb: 2 }}
                            />
                            <Button
                                fullWidth
                                variant='contained'
                                color='primary'
                                type='submit'
                                sx={{ mb: 2, fontSize: 20 }}
                            >
                                ورود
                            </Button>
                        </Form>
                    )}
                </Formik>

                <Button
                    fullWidth
                    variant='contained'
                    color='secondary'
                    type='button'
                    component={Link}
                    to="/"
                    sx={{ fontSize: 20 }}
                >
                    بازگشت
                </Button>

                <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
            </Stack>
        </MainLayout>
    )
}
