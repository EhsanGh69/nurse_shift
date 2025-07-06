import { useState, useEffect } from 'react';
import { Stack, Button, TextField, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { inviteMemberSchema } from '../../validations/matronsValidation';
import { centerBox } from '../../styles/globalStyles'
import SnackAlert from '../../components/SnackAlert';
import { refreshToken } from '../../utils/services';


export default function InviteMember() {
    const navigate = useNavigate()
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const { groupId } = useParams()

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await axios.post('/matron/groups/invite', values, { withCredentials: true })
            setSnackbar({ open: true, message: 'کد دعوت با موفقیت ارسال شد', severity: 'success' })
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
        refreshToken(navigate)
    }, [])

    return (
        <MainLayout title="سرپرستار | دعوت عضو جدید">
            <Stack direction='column' sx={centerBox}>
                <AppHeader />

                <Typography variant='h5' align='center' gutterBottom mb={5}>
                    ارسال کد دعوت عضو جدید
                </Typography>

                <Formik
                    initialValues={{
                        mobile: "", groupId
                    }}
                    validationSchema={inviteMemberSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, errors, touched }) => (
                        <Form style={{ width: "100%" }}>
                            <TextField
                                fullWidth
                                label="موبایل"
                                name='mobile'
                                value={values.mobile}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.mobile && Boolean(errors.mobile)}
                                helperText={touched.mobile && errors.mobile}
                                sx={{ mb: 4 }}
                            />
                            <TextField
                                sx={{ display: 'none' }}
                                name='groupId'
                                type='hidden'
                                value={values.groupId}
                            />
                            <Button
                                fullWidth
                                variant='contained'
                                color='primary'
                                type='submit'
                                sx={{ mb: 2, fontSize: 20 }}
                            >
                                ارسال کد
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

