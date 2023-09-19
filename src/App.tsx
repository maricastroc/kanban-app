import { BoardsContextProvider } from './contexts/BoardsContext'
import Home from './pages/home'
import { globalStyles } from './styles/global'
import 'react-toastify/dist/ReactToastify.css'
import { StyledToastContainer } from './pages/home/styles'
import { TaskContextProvider } from './contexts/TaskContext'

globalStyles()

export function App() {
  return (
    <BoardsContextProvider>
      <TaskContextProvider>
        <StyledToastContainer />
        <Home />
      </TaskContextProvider>
    </BoardsContextProvider>
  )
}

export default App
