import { useEffect } from 'react';
import { Box, Button, Stack } from '@mui/material'
import { Link, useNavigate } from "react-router-dom"

import MainLayout from '../mui/MainLayout'
import { centerBox } from '../styles/globalStyles'
import { userNavigate } from '../utils/services'


export default function Welcome() {
    const navigate = useNavigate()

    useEffect(() => {
        userNavigate(navigate)
    }, [])

    return (
        <MainLayout title="خوش آمدید">
            <Box sx={{ ...centerBox, justifyContent: 'center' }}>
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
