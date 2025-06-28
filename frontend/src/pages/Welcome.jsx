import { Box, Button, Stack } from '@mui/material'
import { Link } from "react-router-dom"

import MainLayout from '../mui/MainLayout'
import { centerBox } from '../styles/globalStyles'


export default function Welcome() {
    return (
        <MainLayout title="خوش آمدید">
            <Box sx={{...centerBox, justifyContent: 'center' }}>
                <Stack spacing={2} alignItems="center">
                    <Button
                        variant='contained'
                        color='primary'
                        component={Link}
                        to="/login"
                        sx={{ width: 300, fontSize: 20 }}
                    >
                        ورود اعضا
                    </Button>
                    <Button
                        variant='outlined'
                        color='success'
                        component={Link}
                        to="/register"
                        sx={{ width: 300, fontSize: 20 }}
                    >
                        ثبت نام عضو جدید
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
