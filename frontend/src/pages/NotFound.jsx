import { Box, Button, Stack, Typography } from '@mui/material'
import { Link } from "react-router-dom"

import MainLayout from '../mui/MainLayout'
import { centerBox } from '../styles/globalStyles'



export default function NotFound() {
    return (
        <MainLayout title="خوش آمدید">
            <Box sx={centerBox}>
                <Stack spacing={2} alignItems="center">
                    <Typography variant='h1'>
                        404
                    </Typography>
                    <Typography variant='h5' sx={{ textAlign: 'center' }}>
                        صفحه ایی که به دنبال آن هستید یافت نشد
                    </Typography>
                    <Button
                        variant='contained'
                        color='secondary'
                        component={Link}
                        to="/"
                        sx={{ width: 300, fontSize: 20 }}
                    >
                        بازگشت
                    </Button>
                </Stack>
            </Box>
        </MainLayout>
    )
}
