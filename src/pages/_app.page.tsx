import { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { lightTheme } from '@/styles/themes/light'
import 'react-toastify/dist/ReactToastify.css'
import { darkTheme } from '@/styles/themes/dark'
import { GlobalStyle } from '@/styles/global'
import { BoardsContextProvider } from '@/contexts/BoardsContext'
import { TaskContextProvider } from '@/contexts/TasksContext'
import { Toaster } from 'react-hot-toast'
import Home from './home'
import { getStorageTheme, saveStorageTheme } from '@/storage/themeConfig'
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  const activeTheme = getStorageTheme()

  const [enableDarkMode, setEnableDarkMode] = useState(
    activeTheme === 'DARK_THEME',
  )

  return (
    <ThemeProvider theme={enableDarkMode ? darkTheme : lightTheme}>
      <BoardsContextProvider>
        <TaskContextProvider>
          <Toaster />
          <Component {...pageProps} />
          <GlobalStyle />
        </TaskContextProvider>
      </BoardsContextProvider>
    </ThemeProvider>
  )
}

export default MyApp
