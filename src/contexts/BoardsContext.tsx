import { BoardDTO } from '../dtos/boardDTO'
import { createContext, ReactNode, useState } from 'react'
import { getFirstStorageBoard, getStorageBoards } from '../storage/boardsConfig'

interface BoardsContextData {
  activeBoard: BoardDTO
  allBoards: BoardDTO[]
  handleSetActiveBoard: (board: BoardDTO) => void
  handleSetAllBoards: (boards: BoardDTO[]) => void
}

export const BoardsContext = createContext<BoardsContextData>(
  {} as BoardsContextData,
)

interface BoardsContextProviderProps {
  children: ReactNode
}

export function BoardsContextProvider({
  children,
}: BoardsContextProviderProps) {
  const [activeBoard, setActiveBoard] = useState<BoardDTO>(
    getFirstStorageBoard(),
  )

  const [allBoards, setAllBoards] = useState<BoardDTO[]>(getStorageBoards())

  function handleSetActiveBoard(board: BoardDTO) {
    setActiveBoard(board)
  }

  function handleSetAllBoards(boards: BoardDTO[]) {
    setAllBoards(boards)
  }

  const BoardsContextValue: BoardsContextData = {
    allBoards,
    activeBoard,
    handleSetActiveBoard,
    handleSetAllBoards,
  }

  return (
    <BoardsContext.Provider value={BoardsContextValue}>
      {children}
    </BoardsContext.Provider>
  )
}
