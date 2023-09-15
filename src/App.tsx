import { BoardsContextProvider } from './contexts/BoardsContext'
import Home from './pages/home'
import { globalStyles } from './styles/global'

globalStyles()

export function App() {
  return (
    <BoardsContextProvider>
      <Home />
    </BoardsContextProvider>
  )
}

export default App
