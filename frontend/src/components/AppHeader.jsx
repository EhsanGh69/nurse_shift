import { useState, useEffect } from 'react'
import { Avatar, Box, Typography, Grid, Button, Menu, MenuItem } from '@mui/material';
import { Sunny, LockReset, Logout, Home } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import SnackAlert from './SnackAlert';
import { useUserData } from "../context/UserContext"
import { headerButton } from "../styles/globalStyles";


export default function AppHeader() {
    const [anchorEl, setAnchorEl] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const open = Boolean(anchorEl)
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const { user } = useUserData()

    const handleOpen = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const handleLogout = async () => {
        axios.post('/auth/logout', {}, { withCredentials: true })
            .then(() => {
                setSnackbar({ open: true, message: 'با موفقیت خارج شدید', severity: 'success' })
                setTimeout(() => navigate('/login'), 1000)
            })
            .catch((err) => {
                console.log(err)
                setSnackbar({ open: true, message: 'خطایی رخ داد', severity: 'error' })
            })
    }

    useEffect(() => {
        const isNotNurse = user?.role !== 'NURSE' && pathname.includes('/nurse')
        const isNurse = user?.role === 'NURSE' && pathname.includes('/matron')
        if (isNotNurse) navigate('/matron')
        if (isNurse) navigate('/nurse')
    }, [])

    return (

        <Box mb={5}>
            <Grid container width={400} justifyContent="space-between">
                <Grid>
                    <Box
                        sx={{
                            backgroundColor: '#f0f0f0',
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            width: 'fit-content',
                            mx: 'auto',
                            mt: 1
                        }}
                    >
                        <Button onClick={handleOpen} size='small'>
                            <Avatar
                                alt={`${user?.firstName} ${user?.lastName}`}
                                src={user?.avatar && `http://127.0.0.1:4000${user?.avatar}`}
                                sx={{ width: 50, height: 50, mr: 1 }}
                            />
                            <Box display="flex" flexDirection="column" alignItems="start">
                                <Typography variant='body2' sx={{ color: '#000' }}>
                                    {`${user?.firstName} ${user?.lastName}`}
                                </Typography>
                                <Typography variant='subtitle2' sx={{ color: 'info.main' }}>
                                    {user?.role === 'NURSE' ? 'پرستار' : 'سرپرستار'}
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
                                <MenuItem onClick={() => navigate("/change_password")}>
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

                <Grid>
                    {(pathname !== '/nurse' && pathname !== '/matron') && (
                        <Button
                            sx={headerButton}
                            LinkComponent={Link}
                            to={user?.role === 'NURSE' ? '/nurse' : '/matron'}
                        >
                            <Home sx={{ fontSize: 30 }} color='success' />
                        </Button>
                    )}
                    <Button sx={{ ...headerButton, ml: 1 }}>
                        <Sunny sx={{ fontSize: 30 }} color='warning' />
                    </Button>
                </Grid>
            </Grid>
            <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
        </Box>
    )
}
