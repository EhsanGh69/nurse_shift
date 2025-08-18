import Grid from '@mui/material/Grid';
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery';

import { centerBox } from '../styles/globalStyles';


export default function MainLayout({ title, children }) {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const preferDark = useMediaQuery('(prefers-color-scheme: dark)')
    const isAuthenticated = !!localStorage.getItem("refreshToken")
    
    return (
        <HelmetProvider>
            <Helmet>
                <title>{title}</title>
            </Helmet>

            <Grid container
                sx={{ margin: 0, minHeight: '100vh' }}
                bgcolor={isDark || (!isAuthenticated && preferDark) ? '#5d5b5bff' : 'lightgray'}
            >
                <Grid
                    bgcolor={isDark || (!isAuthenticated && preferDark) ? '#1916168f' : 'lightgray'}
                    sx={{
                        ...centerBox,

                    }}
                    size={{ xs: 12, lg: 10, xl: 8 }}
                    border="2px solid whitesmoke"
                >
                    {children}
                </Grid>
            </Grid>
        </HelmetProvider>
    )
}
