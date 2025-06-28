import { useState } from 'react'
import { Avatar, Box, Typography, Grid, Button, Menu, MenuItem } from '@mui/material';
import { Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';


export default function AppHeader() {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleOpen = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    return (
        <Grid container spacing={20} direction='row' justifyContent='space-around' maxWidth={600} mb={5}>
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
                        alt='احسان'
                        src='/vite.svg'
                        sx={{ width: 50, height: 50, mr: 2, border: '1px solid black' }}
                    />
                    <Typography variant='body1' sx={{ color: '#000' }}>
                        احسان قنبری
                    </Typography>
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <MenuItem onClick={handleClose}>ویرایش حساب کاربری</MenuItem>
                    <MenuItem onClick={handleClose} component={Link} to="/">خروج</MenuItem>
                </Menu>
            </Box>
            <Button
                sx={{
                    backgroundColor: '#f0f0f0',
                    borderRadius: '50%',
                    height: '50px',
                    minWidth: '50px',
                    width: '50px',
                    mt: 2
                }}
            >
                <Settings sx={{ fontSize: 30 }} />
            </Button>
        </Grid>
    )
}
