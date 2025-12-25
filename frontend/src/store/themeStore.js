import { create } from "zustand"
import generateTheme from '../mui/themes/theme';

export const useThemeStore = create((set) => ({
    theme: generateTheme({
        fontFamily: 'Vazir',
        fontSize: 16,
        themeMode: 'light'
    }),
    setTheme: (theme) => set({ theme })
}))