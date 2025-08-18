import { Button, Stack, Typography } from '@mui/material'
import { useNavigate, useLocation } from "react-router-dom"
import { useTheme } from "@mui/material/styles";

import MainLayout from '../mui/MainLayout'


export default function NotFound() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const color = isDark ? "#f5f5f5" : "#1e1e1e"

    return (
        <MainLayout title="یافت نشد">
            <Stack spacing={2} alignItems="center">
                <Typography variant='h1' sx={{ color }}>
                    404
                </Typography>
                <Typography variant='h5' sx={{ textAlign: 'center', color }}>
                    صفحه ایی که به دنبال آن هستید یافت نشد
                </Typography>
                <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => navigate(state?.backTo || "/")}
                    sx={{ width: 300, fontSize: 25 }}
                >
                    بازگشت
                </Button>
            </Stack>
        </MainLayout>
    )
}
