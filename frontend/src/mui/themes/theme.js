import { createTheme } from '@mui/material/styles';
import { faIR } from '@mui/material/locale';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';

export const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin]
});

const generateTheme = ({ fontFamily, fontSize, themeMode }) => {
    return createTheme({
        direction: 'rtl',
        palette: {
            mode: themeMode
        },
        typography: {
            fontFamily,
            fontSize
        }
    }, faIR)
};

export default generateTheme;