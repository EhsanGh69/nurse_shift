import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'

import { GlobalContextProvider } from "./context/GlobalContext"
import { cacheRtl } from './mui/themes/theme.js';
import { useThemeStore } from "./store/themeStore.js"

import router from "./router";

function App() {
  const theme = useThemeStore((s) => s.theme)

  return (
    <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <GlobalContextProvider>
            <RouterProvider router={router} />
          </GlobalContextProvider>
        </ThemeProvider>
    </CacheProvider>
  )
}

export default App;