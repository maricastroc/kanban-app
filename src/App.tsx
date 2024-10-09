import { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { lightTheme } from './styles/themes/light'
import { darkTheme } from './styles/themes/dark'
import 'react-toastify/dist/ReactToastify.css'
import { Home } from './pages/Home'
import { GlobalStyle } from './styles/global'
import { BoardsContextProvider } from './contexts/BoardsContext'
import { TaskContextProvider } from './contexts/TasksContext'
import { StyledToastContainer } from './pages/Home/styles'
import { getStorageTheme, saveStorageTheme } from './storage/themeConfig'

function App() {
  const activeTheme = getStorageTheme()
  const [enableDarkMode, setEnableDarkMode] = useState(
    activeTheme === 'DARK_THEME',
  )

  return (
    <ThemeProvider theme={enableDarkMode ? darkTheme : lightTheme}>
      <BoardsContextProvider>
        <TaskContextProvider>
          <StyledToastContainer />
          <Home
            onChangeTheme={() => {
              setEnableDarkMode(!enableDarkMode)
              saveStorageTheme(enableDarkMode ? 'LIGHT_THEME' : 'DARK_THEME')
            }}
          />
        </TaskContextProvider>
      </BoardsContextProvider>
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default App
