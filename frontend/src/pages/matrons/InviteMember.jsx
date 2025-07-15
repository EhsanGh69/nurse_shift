import { useState } from 'react';
import { Grid, Button, TextField, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';

import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { inviteMemberSchema } from '../../validations/matronsValidation';
import SnackAlert from '../../components/SnackAlert';
import { useInviteMember } from '../../api/group.api';
import BackButton from '../../components/BackButton';
import handleApiErrors from '../../utils/apiErrors';


export default function InviteMember() {
    const navigate = useNavigate()
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const { groupId } = useParams()
    const { mutateAsync, isPending } = useInviteMember()

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await mutateAsync(values)
            setSnackbar({ open: true, message: 'کد دعوت با موفقیت ارسال شد', severity: 'success' })
            setTimeout(() => navigate(`/matron/groups/${groupId}`), 500)
            resetForm()
        } catch (error) {
            const msg = handleApiErrors(error);
            setSnackbar({ open: true, message: msg, severity: 'error' })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <MainLayout title="سرپرستار | دعوت عضو جدید">
            <AppHeader />
            <Grid size={{ xs: 12, md: 8, lg: 6 }}>

                <Typography variant='h5' align='center' gutterBottom mb={5}>
                    ارسال کد دعوت عضو جدید
                </Typography>

                <Formik
                    initialValues={{
                        mobile: "", groupId, firstName: "", lastName: ""
                    }}
                    validationSchema={inviteMemberSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, errors, touched }) => (
                        <Form style={{ width: "100%" }}>
                            <TextField
                                fullWidth
                                label="نام"
                                name='firstName'
                                value={values.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.firstName && Boolean(errors.firstName)}
                                helperText={touched.firstName && errors.firstName}
                                sx={{ mb: 4 }}
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
                                sx={{ mb: 4 }}
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
                                disabled={isPending}
                            >
                                ارسال کد
                            </Button>
                            <BackButton backUrl={`/matron/groups/${groupId}`} />
                        </Form>
                    )}
                </Formik>

                <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
            </Grid>
        </MainLayout>
    )
}

