import { Stack, Button, TextField, Typography, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom'

import { registerSchema } from '../../validations/authValidation'
import MainLayout from '../../mui/MainLayout';
import { centerBox } from '../../styles/globalStyles'

export default function Register() {
    return (
        <MainLayout title="ثبت نام">
            <Stack direction='column' justifyContent='center'
                // sx={{ maxWidth: 400, height: '100vh', mx: 'auto' }}
                sx={centerBox}
            >
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
                    onSubmit={(values) => {
                        console.log(values)
                    }}
                >
                    {({ values, handleChange, handleBlur, errors, touched }) => (
                        <Form>
                            <TextField
                                fullWidth
                                label="کد دعوت"
                                name='inviteCode'
                                value={values.inviteCode}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.inviteCode && Boolean(errors.inviteCode)}
                                helperText={touched.inviteCode && errors.inviteCode}
                                sx={{ mb: 2 }}
                            />
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
                                sx={{ mb: 2 }}
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
                >
                    بازگشت
                </Button>
            </Stack>
        </MainLayout>
    )
}
