import { useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { ListAlt, CalendarMonth, TableChart, EventNote, SwitchAccount, Groups3 } from '@mui/icons-material';

import { clickBox } from '../../styles/globalStyles';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';


export default function ShiftsManagement() {
    const items = useMemo(() => [
        { title: 'تنظیمات شیفت', icon: <ListAlt fontSize='large' />, route: '/shifts/matron/settings' },
        { title: 'اطلاعات پرستاران', icon: <SwitchAccount fontSize='large' />, route: '/shifts/matron/infos' },
        { title: 'زیر گروه ها', icon: <Groups3 fontSize='large' />, route: '/shifts/matron/subgroups' },
        { title: 'شیفت های پرستاران', icon: <EventNote fontSize='large' />, route: '/shifts/matron/manage' },
        { title: 'آرشیو جداول', icon: <TableChart fontSize='large' />, route: '/shifts/matron/tables' },
        { title: 'شیفت های من', icon: <CalendarMonth fontSize='large' />, route: '/shifts' },
    ])

    return (
        <MainLayout title="سرپرستار | مدیریت شیفت ها">
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

