import { Stack, Button, TextField, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom'

import { loginSchema } from '../../validations/authValidation'
import MainLayout from '../../mui/MainLayout';
import { centerBox } from '../../styles/globalStyles'

export default function Login() {
    return (
        <MainLayout title="ورود">
            <Stack direction='column' justifyContent='center'
                // sx={{ maxWidth: 400, height: '100vh', mx: 'auto' }}
                sx={centerBox}
            >
                <Typography variant='h4' align='center' gutterBottom>
                    ورود اعضاء
                </Typography>

                <Formik
                    initialValues={{
                        nationalCode: "", password: ""
                    }}
                    validationSchema={loginSchema}
                    onSubmit={(values) => {
                        console.log(values)
                    }}
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
                                sx={{ mb: 2 }}
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
                >
                    بازگشت
                </Button>
            </Stack>
        </MainLayout>
    )
}
