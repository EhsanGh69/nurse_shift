import { useState, useEffect } from 'react'
import { Avatar, Box, Typography, Grid, Button, Menu, MenuItem } from '@mui/material';
import { Sunny, LockReset, Logout, Home } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import SnackAlert from './SnackAlert';
import { refreshToken, getUserData } from "../utils/services";
import { headerButton } from "../styles/globalStyles";


export default function AppHeader() {
    const [userData, setUserData] = useState({})
    const [anchorEl, setAnchorEl] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const open = Boolean(anchorEl)
    const navigate = useNavigate()
    const { pathname } = useLocation()

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

    const handleUserData = async () => {
        const data = await getUserData()
        setUserData(data)
    }

    useEffect(() => {
        refreshToken(navigate)
        handleUserData()
    }, [])

    return (

        <Box mb={5}>
            <Grid container width={400} justifyContent="space-between">
                <Grid item>
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
                        <Button onClick={handleOpen} size='large'>
                            <Avatar
                                alt={`${userData.firstName} ${userData.lastName}`}
                                src={userData.avatar}
                                sx={{ width: 50, height: 50, mr: 1, border: '1px solid black' }}
                            />
                            <Typography variant='body2' sx={{ color: '#000' }}>
                                {`${userData.firstName} ${userData.lastName}`}
                            </Typography>
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

                <Grid item>
                    {pathname !== '/nurse' && (
                        <Button sx={headerButton} LinkComponent={Link} to="/nurse">
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
