import { useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Settings, QuestionAnswer, Poll, Tune, CalendarMonth } from '@mui/icons-material';

import { clickBox } from '../../styles/globalStyles';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';

export default function NurseHome() {
    const items = useMemo(() => [
        { title: 'ویرایش حساب کاربری', icon: <Settings fontSize='large' />, route: '/account/edit' },
        { title: 'گفت و گو ها', icon: <QuestionAnswer fontSize='large' />, route: '/messages/conversations' },
        { title: 'نظرسنجی برنامه', icon: <Poll fontSize='large' />, route: '/poll' },
        { title: 'تنظیمات برنامه', icon: <Tune fontSize='large' />, route: '/settings' },
        { title: 'شیفت های من', icon: <CalendarMonth fontSize='large' />, route: '/shifts' },
    ])

    return (
        <MainLayout title="پرستار | خانه">
            <AppHeader />
            <Grid container spacing={3} width="100%">
                {items.map(item => (
                    <Grid
                        size={{ xs: 6, md: 4 }}
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
        </MainLayout>
    )
}
