import { useState } from 'react';
import { Grid, Button, TextField, Typography, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';

import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { createGroupSchema } from '../../validations/matronsValidation';
import SnackAlert from '../../components/SnackAlert';
import { useCreateGroup } from '../../api/group.api';
import handleApiErrors from '../../utils/apiErrors';
import BackButton from '../../components/BackButton';


export default function CreateGroup() {
    const navigate = useNavigate()
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const { isPending, mutateAsync } = useCreateGroup()

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await mutateAsync(values)
            setSnackbar({ open: true, message: 'گروه جدید با موفقیت ایجاد شد', severity: 'success' })
            setTimeout(() => navigate('/matron/groups'), 500)
            resetForm()
        } catch (error) {
            const msg = handleApiErrors(error);
            setSnackbar({ open: true, message: msg, severity: 'error' })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <MainLayout title="سرپرستار | افزودن گروه جدید">
            <AppHeader />
            <Grid size={{ xs: 12, md: 8, lg: 6 }}>

                <Typography variant='h5' align='center' gutterBottom mb={5}>
                    افزودن گروه جدید
                </Typography>

                <Formik
                    initialValues={{
                        province: "", county: "", hospital: "", department: ""
                    }}
                    validationSchema={createGroupSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, errors, touched }) => (
                        <Form style={{ width: "100%" }}>
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
                            <TextField
                                fullWidth
                                label="بیمارستان"
                                name="hospital"
                                value={values.hospital}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.hospital && Boolean(errors.hospital)}
                                helperText={touched.hospital && errors.hospital}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="بخش"
                                name="department"
                                value={values.department}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.department && Boolean(errors.department)}
                                helperText={touched.department && errors.department}
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
                                ثبت اطلاعات
                            </Button>
                            <BackButton backUrl="/matron/groups" />
                        </Form>
                    )}
                </Formik>

                <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
            </Grid>
        </MainLayout>
    )
}

