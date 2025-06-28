import { Avatar, Box, Typography, Grid } from '@mui/material';
import { Settings } from '@mui/icons-material';


export default function AppHeader() {
    return (
        <Grid container spacing={22} justifyContent='space-around' maxWidth={600} mb={5}>
            <Box
                sx={{
                    backgroundColor: '#f0f0f0',
                    borderRadius: 3,
                    padding: 1,
                    display: 'flex',
                    alignItems: 'center',
                    width: 'fit-content',
                    mx: 'auto',
                    mt: 1
                }}
            >
                <Avatar
                    alt='احسان'
                    src='/vite.svg'
                    sx={{ width: 50, height: 50, mr: 2, border: '1px solid black' }}
                />
                <Typography variant='body1'>
                    احسان قنبری
                </Typography>
            </Box>
            <Box
                sx={{
                    backgroundColor: '#f0f0f0',
                    borderRadius: '50%',
                    padding: 1,
                    display: 'flex',
                    alignItems: 'center',
                    mx: 'auto',
                    mt: 1,
                    width: 40,
                    height: 40,
                    justifyContent: 'center'
                }}
            >
                
                <Settings sx={{ fontSize: 30 }} />
            </Box>
        </Grid>
    )
}
