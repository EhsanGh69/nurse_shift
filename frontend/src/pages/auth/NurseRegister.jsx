import { useState } from 'react';
import { Button, TextField, Typography, Grid } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';

import { nurseRegisterSchema } from '../../validations/authValidation'
import MainLayout from '../../mui/MainLayout';
import { nurseRegisterFields } from '../../constants/fields';
import SnackAlert from '../../components/SnackAlert';
import { useRegister } from '../../api/auth.api';
import handleApiErrors from '../../utils/apiErrors';
import BackButton from '../../components/BackButton';


export default function NurseRegister() {
    const navigate = useNavigate()
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const { mutateAsync, isPending } = useRegister()

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await mutateAsync({ formData: values, role: 'nurse' })
            setSnackbar({ open: true, message: 'ثبت نام با موفقیت انجام شد', severity: 'success' })
            setTimeout(() => navigate('/login'), 500)
            resetForm()
        } catch (error) {
            const msg = handleApiErrors(error)
            setSnackbar({ open: true, message: msg, severity: 'error' })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <MainLayout title="ثبت نام">
            <Grid height="100vh" display="flex" flexDirection="column" justifyContent="center"
                size={{ xs: 12, sm: 8, md: 6, xl: 5 }}
            >
                <Typography variant='h4' align='center' gutterBottom>
                    ثبت نام پرستار
                </Typography>

                <Formik
                    initialValues={{ inviteCode: "", nationalCode: "", password: "" }}
                    validationSchema={nurseRegisterSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, errors, touched }) => (
                        <Form>
                            {nurseRegisterFields.map((field, index) => (
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

                            <Button
                                fullWidth
                                variant='contained'
                                color='primary'
                                type='submit'
                                sx={{ mb: 2, fontSize: 20 }}
                                disabled={isPending}
                            >
                                ثبت اطلاعات
                            </Button>
                            <BackButton backUrl="/" />
                        </Form>
                    )}
                </Formik>

            </Grid>

            <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
        </MainLayout>
    )
}
