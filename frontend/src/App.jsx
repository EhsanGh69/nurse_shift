import { useMemo, useEffect, useState } from 'react';
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'

import { GlobalContextProvider } from "./context/GlobalContext"
import generateTheme from './mui/themes/theme';
import { useCurrentSettings } from './api/setting.api';
import LoadingModal from './components/LoadingModal';
import { cacheRtl } from './mui/themes/theme.js';

import router from "./router";

function App() {
  const { isLoading, data } = useCurrentSettings()

  const theme = useMemo(() => {
    if (!isLoading && data) {
      return generateTheme({
        fontFamily: data.fontFamily,
        fontSize: data.fontSize,
        themeMode: data.themeMode
      })
    }

    return generateTheme({
      fontFamily: 'Vazir',
      fontSize: 16,
      themeMode: 'light'
    })
  }, [isLoading, data])

  if (isLoading) return <LoadingModal open={isLoading} />

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