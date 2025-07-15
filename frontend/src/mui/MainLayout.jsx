import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material';
import { HelmetProvider, Helmet } from "react-helmet-async";
import Grid from '@mui/material/Grid';

import theme, { cacheRtl } from './themes/theme';
import { centerBox } from '../styles/globalStyles';


export default function MainLayout({ title, children }) {
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <HelmetProvider>
                    <Helmet>
                        <title>{title}</title>
                    </Helmet>

                    <Grid container sx={{ backgroundColor: 'lightgray', margin: 0, minHeight: '100vh', }}>
                        <Grid 
                            size={{ xs: 12, lg: 8}} 
                            sx={centerBox} 
                            border="2px solid whitesmoke"
                        >
                            {children}
                        </Grid>
                    </Grid>
                </HelmetProvider>
            </ThemeProvider>
        </CacheProvider>
    )
}
