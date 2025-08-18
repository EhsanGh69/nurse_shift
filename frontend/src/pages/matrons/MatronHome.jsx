import { Box, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Settings, Group, QuestionAnswer, Poll, ManageAccounts, CalendarMonth } from '@mui/icons-material';

import { clickBox } from '../../styles/globalStyles';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';

const items = [
    { title: 'مدیریت شیفت ها', icon: <CalendarMonth fontSize='large' />, route: '/shifts' },
    { title: 'گروه ها', icon: <Group fontSize='large' />, route: '/matron/groups' },
    { title: 'ویرایش کاربر', icon: <ManageAccounts fontSize='large' />, route: '/account/edit' },
    { title: 'گفت و گو ها', icon: <QuestionAnswer fontSize='large' />, route: '/messages/conversations' },
    { title: 'تنظیمات برنامه', icon: <Settings fontSize='large' />, route: '/settings' },
    { title: 'نظرسنجی برنامه', icon: <Poll fontSize='large' />, route: '/poll' },
]


export default function MatronHome() {
    return (
        <MainLayout title="سرپرستار | خانه">
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
                        <Typography variant='h6'>{item.title}</Typography>
                    </Grid>
                ))}
            </Grid>
        </MainLayout>
    )
}
