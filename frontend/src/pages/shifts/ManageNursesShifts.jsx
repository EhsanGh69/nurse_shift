import { Box, Typography, Paper, Button, Divider, Grid } 
from '@mui/material';
import { Link } from 'react-router-dom';

import ShiftGroup from '../../components/shift/ShiftGroup';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { PermContactCalendar } from '@mui/icons-material';

const shiftData = [
    { title: 'M', users: ['user1', 'user2'] },
    { title: 'E', users: ['user3', 'user4'] },
    { title: 'N', users: ['user3', 'user5'] },
]

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
                {shiftData.map(shift => (
                    <Paper 
                        key={shift.title} elevation={3}
                        sx={{ p: 2, border: '2px solid #1976d2' }}
                    >
                        <Typography variant='h6'sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                            {shift.title}
                        </Typography>

                        <Box
                            sx={{
                                border: '2px dashed #ddd',
                                padding: 2,
                                marginTop: 2,
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2
                            }}
                        >
                            {shift.users.map((user, idx) => (
                                <Box key={idx}
                                    sx={{
                                        border: '1px solid #cfaeaeff',
                                        borderRadius: 2,
                                        padding: 1.5,
                                        backgroundColor: '#f0f8ff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 'bold', color: "#726d6dff" }}>
                                        {user}
                                    </Typography>
                                    <Divider orientation='vertical' flexItem 
                                    sx={{ backgroundColor: "#000" }} />
                                    <Button variant='contained' color='error'>
                                        رد شیفت
                                    </Button>
                                    <Button variant='contained' color='primary'>
                                        تغییر شیفت
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                ))}
            </Grid>
        </Grid>
    </MainLayout>
  )
}
