import { Typography, Paper, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

import ShiftGroup from '../../components/shift/ShiftGroup';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { PermContactCalendar } from '@mui/icons-material';
import ShiftDaysList from '../../components/manageShift/ShiftDaysList';


export default function ManageNursesShifts() {

  return (
    <MainLayout title="شیفت های پرستاران">
        <AppHeader />
        <Grid container width="100%">
            <Grid size={{ xs: 12 }}>
                <Button
                    color="info"
                    variant="contained"
                    sx={{ mb: 2 }}
                    LinkComponent={Link}
                    size="large"
                    to="/shifts/matron"
                    >
                        <PermContactCalendar sx={{ mr: 1 }} />
                        <Typography variant="h6">بازگشت به مدیریت شیفت ها</Typography>
                </Button>
            </Grid>
            
            <ShiftGroup />

            <Grid size={{ xs: 12 }}>
                <Paper
                    elevation={3}
                    sx={{ p: 2, border: '2px solid #1976d2' }}
                >
                    <Typography
                        variant='h6'
                        color='warning'
                        sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                        M: صبح | E: عصر | N: شب | V: مرخصی | H: تعطیل
                    </Typography>
                </Paper>
            </Grid>

            <ShiftDaysList />
            
        </Grid>
    </MainLayout>
  )
}
