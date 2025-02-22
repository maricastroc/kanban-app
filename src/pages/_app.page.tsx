import { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { lightTheme } from '@/styles/themes/light'
import 'react-toastify/dist/ReactToastify.css'
import { darkTheme } from '@/styles/themes/dark'
import { GlobalStyle } from '@/styles/global'
import { AppProps } from 'next/app'
import { BoardsContextProvider } from '@/contexts/BoardsContext'
import { TaskContextProvider } from '@/contexts/TasksContext'
import { StyledToastContainer } from './home/styles'
import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps }: AppProps) {
  const activeTheme = 'DARK_THEME'
  const [isDarkMode, setIsDarkMode] = useState(activeTheme === 'DARK_THEME')

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'LIGHT_THEME' : 'DARK_THEME'
    setIsDarkMode(!isDarkMode)
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
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
