import { useState, useEffect } from 'react';
import { Stack, Button, TextField, Typography, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

import { registerSchema } from '../../validations/authValidation'
import MainLayout from '../../mui/MainLayout';
import { centerBox } from '../../styles/globalStyles';
import { registerFields } from '../../constants/fields';
import SnackAlert from '../../components/SnackAlert';
import { userNavigate } from '../../utils/services'


export default function Register() {
    const navigate = useNavigate()
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await axios.post('/auth/register', values)
            setSnackbar({ open: true, message: 'ثبت نام با موفقیت انجام شد', severity: 'success' })
            setTimeout(() => navigate('/login'), 1500)
            resetForm()
        } catch (error) {
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
        <MainLayout title="ثبت نام">
            <Stack direction='column' sx={centerBox}>
                <Typography variant='h4' align='center' gutterBottom>
                    ثبت نام عضو جدید
                </Typography>

                <Formik
                    initialValues={{
                        firstName: "", lastName: "",
                        inviteCode: "", nationalCode: "",
                        mobile: "", password: "",
                        province: "", county: ""
                    }}
                    validationSchema={registerSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, errors, touched }) => (
                        <Form>
                            {registerFields.map((field, index) => (
                                <TextField
                                    key={index}
                                    fullWidth
                                    label={field.label}
                                    name={field.name}
                                    type={field.type}
                                    value={values[field.name]}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched[field.name] && Boolean(errors[field.name])}
                                    helperText={touched[field.name] && errors[field.name]}
                                    sx={{ mb: 2 }}
                                />
                            ))}

                            <TextField
                                fullWidth
                                select
                                label="استان"
                                name='province'
                                value={values.province}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.province && Boolean(errors.province)}
                                helperText={touched.province && errors.province}
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value="markazi">
                                    مرکزی
                                </MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                select
                                label="شهرستان"
                                name='county'
                                value={values.county}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.county && Boolean(errors.county)}
                                helperText={touched.county && errors.county}
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value="arak">
                                    اراک
                                </MenuItem>
                            </TextField>
                            <Button
                                fullWidth
                                variant='contained'
                                color='primary'
                                type='submit'
                                sx={{ mb: 2, fontSize: 20 }}
                            >
                                ثبت اطلاعات
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
