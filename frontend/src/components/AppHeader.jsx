import { useState, useContext } from 'react'
import { Avatar, Box, Typography, Grid, Button, Menu, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles'
import { Sunny, LockReset, Logout, Home, Bedtime } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import SnackAlert from './SnackAlert';
import { headerButton } from "../styles/globalStyles";
import { useLogout } from '../api/auth.api';
import { useChangeTheme } from '../api/setting.api';
import handleApiErrors from '../utils/apiErrors';
import { GlobalContext } from "../context/GlobalContext";


export default function AppHeader() {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const { mutateAsync } = useLogout()
    const { mutateAsync: changeTheme } = useChangeTheme()
    const { getData } = useContext(GlobalContext)
    const userData = getData("userData")
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    const handleOpen = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)
    const queryClient = useQueryClient()

    const handleLogout = async () => {
        try {
            await mutateAsync()
            queryClient.clear()
            setSnackbar({ open: true, message: 'با موفقیت خارج شدید', severity: 'success' })
            setTimeout(() => navigate('/login'), 500)
        } catch (error) {
            const msg = handleApiErrors(err)
            setSnackbar({ open: true, message: msg, severity: 'error' })
        }
    }

    const handleChangeTheme = async () => {
        try { await changeTheme() } catch (error) {}
    }

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
                            <Button 
                                onClick={handleOpen} 
                                size='small'
                                sx={{
                                    backgroundColor: isDark ? '#5a5858ff' : '#ffffff'
                                }}
                            >
                                <Avatar
                                    alt={userData.firstName}
                                    src={userData.avatar && `http://127.0.0.1:4000${userData.avatar}`}
                                    sx={{ 
                                        width: 50, height: 50, mr: 1,
                                        backgroundColor: isDark ? '#9e9b9bff' : null
                                    }}
                                />
                                <Box display="flex" flexDirection="column" alignItems="start">
                                    <Typography variant='h6' sx={{ color: isDark ? '#ffffff' : '#1e1e1e' }}>
                                        {`${userData.firstName} ${userData.lastName}`}
                                    </Typography>
                                    <Typography 
                                    variant='subtitle1' 
                                    fontWeight={800}
                                    sx={{ color: isDark ? '#9cb5ebff' : '#7366e9ff' }}>
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
                                sx={{
                                    ...headerButton,
                                    backgroundColor: isDark ? '#f0f0f0' : '#1c4a2eff',
                                }}
                                LinkComponent={Link}
                                to={userData.role === 'NURSE' ? '/nurse' : '/matron'}
                            >
                                <Home sx={{ 
                                        fontSize: 30,
                                        color: isDark ? '#1c4a2eff' : '#f0f0f0'
                                    }} 
                                />
                            </Button>
                        )}
                        <Button sx={{ 
                                ...headerButton, ml: 1,
                                backgroundColor: isDark ? '#f0f0f0' : 'info.main',
                            }}
                            onClick={handleChangeTheme}
                        >
                            {isDark 
                                ? <Sunny sx={{ fontSize: 30 }} color='warning' />
                                : <Bedtime sx={{ fontSize: 30, color: "#ddd" }} />
                            }
                        </Button>
                    </Grid>
                    <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
                </Grid>
            )}
        </>
    )
}
