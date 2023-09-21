import { BoardsContextProvider } from './contexts/BoardsContext'
import Home from './pages/home'
import 'react-toastify/dist/ReactToastify.css'
import { StyledToastContainer } from './pages/home/styles'
import { TaskContextProvider } from './contexts/TaskContext'
import { ThemeProvider } from 'styled-components'
import { darkTheme } from './styles/themes/dark'
import { GlobalStyle } from './styles/global'
import { lightTheme } from './styles/themes/light'
import { useState } from 'react'

export function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(true)

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <BoardsContextProvider>
        <TaskContextProvider>
          <StyledToastContainer />
          <Home onChangeTheme={() => setIsDarkTheme(!isDarkTheme)} />
        </TaskContextProvider>
      </BoardsContextProvider>
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default App
