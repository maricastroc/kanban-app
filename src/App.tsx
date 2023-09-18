import { BoardsContextProvider } from './contexts/BoardsContext'
import Home from './pages/home'
import { globalStyles } from './styles/global'
import 'react-toastify/dist/ReactToastify.css'
import { StyledToastContainer } from './pages/home/styles'

globalStyles()

export function App() {
  return (
    <BoardsContextProvider>
      <StyledToastContainer />
      <Home />
    </BoardsContextProvider>
  )
}

export default App
