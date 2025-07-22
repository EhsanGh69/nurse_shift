import { useState, useEffect } from 'react'
import { Avatar, Box, Typography, Grid, Button, Menu, MenuItem } from '@mui/material';
import { Sunny, LockReset, Logout, Home } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import SnackAlert from './SnackAlert';
import { headerButton } from "../styles/globalStyles";
import { useLogout } from '../api/auth.api';
import handleApiErrors from '../utils/apiErrors';
import { useGlobalData } from "../context/GlobalContext";


export default function AppHeader() {
    const [anchorEl, setAnchorEl] = useState(null)
    const [userData, setUserData] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const open = Boolean(anchorEl)
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const { mutateAsync } = useLogout()
    const { getData } = useGlobalData()
    const data = getData("userData")

    const handleOpen = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const handleLogout = async () => {
        try {
            await mutateAsync()
            setSnackbar({ open: true, message: 'با موفقیت خارج شدید', severity: 'success' })
            setTimeout(() => navigate('/login'), 500)
        } catch (error) {
            const msg = handleApiErrors(err)
            setSnackbar({ open: true, message: msg, severity: 'error' })
        }
    }

    useEffect(() => {
        if(data)
            setUserData(data)
    }, [data])

    return (
        <>
            {userData && (
                <Grid container width="100%" mb={5}>
                    <Grid size={{ xs: 6 }}>
                        <Box
                            sx={{
                                backgroundColor: '#f0f0f0',
                                borderRadius: 3,
                                display: 'flex',
                                justifyContent: 'end',
                                width: 'fit-content'
                            }}
                        >
                            <Button onClick={handleOpen} size='small'>
                                <Avatar
                                    alt={userData.firstName}
                                    src={userData.avatar && `http://127.0.0.1:4000${userData.avatar}`}
                                    sx={{ width: 50, height: 50, mr: 1 }}
                                />
                                <Box display="flex" flexDirection="column" alignItems="start">
                                    <Typography variant='h6' sx={{ color: '#000' }}>
                                        {`${userData.firstName} ${userData.lastName}`}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: 'info.main' }}>
                                        {userData.role === 'NURSE' ? 'پرستار' : 'سرپرستار'}
                                    </Typography>
                                </Box>
                            </Button>

                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                            >
                                {pathname !== '/change_password' && (
                                    <MenuItem onClick={() => navigate("/account/change_password")}>
                                        <LockReset sx={{ fontSize: '30px', color: 'info.main' }} />
                                        <Typography ml={2}>تغییر رمز عبور</Typography>
                                    </MenuItem>
                                )}
                                <MenuItem onClick={handleLogout}>
                                    <Logout sx={{ fontSize: '30px', color: 'error.main' }} />
                                    <Typography ml={2}>خروج</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 6 }} display="flex" justifyContent="end" alignItems="center">
                        {(pathname !== '/nurse' && pathname !== '/matron') && (
                            <Button
                                sx={headerButton}
                                LinkComponent={Link}
                                to={userData.role === 'NURSE' ? '/nurse' : '/matron'}
                            >
                                <Home sx={{ fontSize: 30 }} color='success' />
                            </Button>
                        )}
                        <Button sx={{ ...headerButton, ml: 1 }}>
                            <Sunny sx={{ fontSize: 30 }} color='warning' />
                        </Button>
                    </Grid>
                    <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
                </Grid>
            )}
        </>
    )
}
