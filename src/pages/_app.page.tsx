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

function MyApp() {
  const activeTheme = getStorageTheme()

  const [enableDarkMode, setEnableDarkMode] = useState(
    activeTheme === 'DARK_THEME',
  )

  return (
    <ThemeProvider theme={enableDarkMode ? darkTheme : lightTheme}>
      <BoardsContextProvider>
        <TaskContextProvider>
          <Toaster />
          <Home
            onChangeTheme={() => {
              setEnableDarkMode(!enableDarkMode)
              saveStorageTheme(enableDarkMode ? 'LIGHT_THEME' : 'DARK_THEME')
            }}
          />
          <GlobalStyle />
        </TaskContextProvider>
      </BoardsContextProvider>
    </ThemeProvider>
  )
}

export default MyApp
