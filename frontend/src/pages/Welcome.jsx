import { Box, Button, Stack } from '@mui/material';
import { Link } from "react-router-dom";

import MainLayout from '../mui/MainLayout';

export default function Welcome() {
    return (
        <MainLayout title="خوش آمدید">
            <Box height="100vh" display="flex" alignItems="center">
                <Stack spacing={2} alignItems="center">
                    <Button
                        variant='contained'
                        color='primary'
                        component={Link}
                        to="/login"
                        sx={{ width: 300, fontSize: 20 }}
                    >
                        ورود
                    </Button>
                    <Button
                        variant='outlined'
                        color='success'
                        component={Link}
                        to="/register/matron"
                        sx={{ width: 300, fontSize: 20 }}
                    >
                        ثبت نام سرپرستار
                    </Button>
                    <Button
                        variant='outlined'
                        color='success'
                        component={Link}
                        to="/register/nurse"
                        sx={{ width: 300, fontSize: 20 }}
                    >
                        ثبت نام پرستار
                    </Button>
                    <Button
                        variant='outlined'
                        color='success'
                        component={Link}
                        to="/nurse"
                        sx={{ width: 300, fontSize: 20 }}
                    >
                        پنل پرستار
                    </Button>
                </Stack>
            </Box>
        </MainLayout>
    )
}
