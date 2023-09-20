import { BoardsContextProvider } from './contexts/BoardsContext'
import Home from './pages/home'
import 'react-toastify/dist/ReactToastify.css'
import { StyledToastContainer } from './pages/home/styles'
import { TaskContextProvider } from './contexts/TaskContext'
import { ThemeProvider } from 'styled-components'
import { darkTheme } from './styles/themes/dark'
import { GlobalStyle } from './styles/global'

export function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <BoardsContextProvider>
        <TaskContextProvider>
          <StyledToastContainer />
          <Home />
        </TaskContextProvider>
      </BoardsContextProvider>
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default App
