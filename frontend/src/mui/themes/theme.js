import { createTheme } from '@mui/material/styles';
import { faIR } from '@mui/material/locale';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';

export const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin]
});

const theme = createTheme({
    direction: 'rtl',
    typography: {
        fontFamily: 'Vazir, Arial'
    }
}, faIR);

export default theme;