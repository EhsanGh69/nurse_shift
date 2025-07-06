import { useState, useEffect } from "react";
import { Box, Grid, Typography, CircularProgress, Backdrop, Alert, Button, Avatar } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { PersonAdd, Phone, PersonOff, Group } from '@mui/icons-material';

import { centerBox } from '../../styles/globalStyles';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { getMatronGroupDetails, refreshToken } from '../../utils/services';


export default function GroupDetails() {
    const [group, setGroup] = useState({})
    const [loading, setLoading] = useState(false)
    const { groupId } = useParams()

    const handleMatronGroupDetails = async () => {
        await refreshToken()
        const matronGroupDetails = await getMatronGroupDetails(groupId, setLoading)
        setGroup(matronGroupDetails)
    }

    useEffect(() => {
        handleMatronGroupDetails()
    }, [])

    return (
        <MainLayout title="سرپرستار | گروه ها">
            <Box sx={centerBox}>
                <AppHeader />
                <Grid container justifyContent='center' width="90%">
                    <Backdrop open={loading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                        <CircularProgress color="inherit" />
                    </Backdrop>

                    <Button
                        color="success"
                        variant="contained"
                        sx={{ mb: 2 }}
                        LinkComponent={Link}
                        to={`/matron/groups/${groupId}/invite`}
                    >
                        <PersonAdd sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">دعوت عضو جدید</Typography>
                    </Button>

                    {group
                        ? (
                            <>
                                <Grid
                                    size={{ xs: 12 }}
                                >
                                    <Alert color="success">
                                        <Box display="flex" width="100%">
                                            <Group sx={{ mr: 2 }} />
                                            <Typography variant='body1'>
                                                {group.department} - {group.hospital} - {group.county}
                                            </Typography>
                                        </Box>
                                    </Alert>
                                </Grid>
                                {group?.members?.length
                                    ? group?.members?.map(member => (
                                        <Box
                                            key={member.mobile}
                                            sx={{
                                                mt: 2,
                                                backgroundColor: 'info.light',
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '100%',
                                                borderRadius: 1
                                            }}
                                        >
                                            <Avatar
                                                alt={`${member?.firstName} ${member?.lastName}`}
                                                src={member?.avatar && `http://127.0.0.1:4000${member?.avatar}`}
                                                sx={{ width: 50, height: 50, mr: 1 }}
                                            />
                                            <Typography variant='body2'
                                                sx={{ color: '#fff', borderRight: 1, pr: 1 }}>
                                                {`${member?.firstName} ${member?.lastName}`} 
                                            </Typography>
                                            <Typography variant='body2' 
                                                sx={{ color: 'lightgray', pl: 1, fontSize: 15, 
                                                display: 'flex', alignItems: 'center' }}>
                                                <Phone />
                                                {member.mobile}
                                            </Typography>
                                        </Box>
                                    ))
                                    : (
                                        <Box
                                            sx={{
                                                mt: 2,
                                                backgroundColor: 'warning.light',
                                                p: 2,
                                                color: 'error.dark',
                                                textAlign: 'center',
                                                borderRadius: 1
                                            }}
                                        >
                                            <PersonOff />
                                            <Typography variant="h6">این گروه عضوی ندارد</Typography>
                                        </Box>
                                    )
                                }
                            </>
                        )
                        : (
                            <Alert color="warning" severity="warning">
                                <Typography variant="body1">اطلاعاتی جهت نمایش وجود ندارد</Typography>
                            </Alert>
                        )
                    }
                </Grid>
            </Box>
        </MainLayout>
    )
}
