import { useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Settings, Group, QuestionAnswer, Poll, Tune } from '@mui/icons-material';

import { centerBox, clickBox } from '../../styles/globalStyles';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { refreshToken } from "../../utils/services";

const items = [
    { title: 'ویرایش حساب کاربری', icon: <Settings />, route: '/edit_account' },
    { title: 'گروه ها', icon: <Group />, route: '/matron/groups' },
    { title: 'پیام ها', icon: <QuestionAnswer />, route: '/messages' },
    { title: 'نظرسنجی برنامه', icon: <Poll />, route: '/poll' },
    { title: 'تنظیمات برنامه', icon: <Tune />, route: '/settings' }
]


export default function MatronHome() {
    useEffect(() => {
        refreshToken()
    }, [])

    return (
        <MainLayout title="سرپرستار | خانه">
            <Box sx={centerBox}>
                <AppHeader />
                <Grid container spacing={3} justifyContent='center'>
                    {items.map(item => (
                        <Grid
                            size={{ xs: 6 }}
                            key={item.route}
                            sx={clickBox}
                            component={Link}
                            to={item.route}
                        >
                            <Box sx={{ mb: 1 }}>{item.icon}</Box>
                            <Typography variant='subtitle1'>{item.title}</Typography>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </MainLayout>
    )
}
