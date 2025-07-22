import { Button, Stack, Typography } from '@mui/material'
import { useNavigate, useLocation } from "react-router-dom"

import MainLayout from '../mui/MainLayout'


export default function NotFound() {
    const { state } = useLocation()
    const navigate = useNavigate()

    return (
        <MainLayout title="یافت نشد">
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
                    onClick={() => navigate(state?.backTo || "/")}
                    sx={{ width: 300, fontSize: 20 }}
                >
                    بازگشت
                </Button>
            </Stack>
        </MainLayout>
    )
}
