import { Box, Button, Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from "react-router-dom";

import MainLayout from '../mui/MainLayout';

export default function Welcome() {
    const preferDark = useMediaQuery('(prefers-color-scheme: dark)')
    return (
        <MainLayout title="خوش آمدید">
            <Box height="100vh" display="flex" alignItems="center">
                <Stack spacing={2} alignItems="center">
                    <Button
                        variant='contained'
                        component={Link}
                        to="/login"
                        sx={{ 
                            width: 300, fontSize: 25,
                            bgcolor: preferDark ? '#64a8ecff' : 'primary.main'
                         }}
                    >
                        ورود
                    </Button>
                    <Button
                        variant='outlined'
                        color={preferDark ? 'warning' : 'success'}
                        component={Link}
                        to="/register/matron"
                        sx={{ width: 300, fontSize: 20 }}
                    >
                        ثبت نام سرپرستار
                    </Button>
                    <Button
                        variant='outlined'
                        color={preferDark ? 'warning' : 'success'}
                        component={Link}
                        to="/register/nurse"
                        sx={{ width: 300, fontSize: 20 }}
                    >
                        ثبت نام پرستار
                    </Button>
                </Stack>
            </Box>
        </MainLayout>
    )
}
