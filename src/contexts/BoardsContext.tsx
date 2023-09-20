import { createContext, ReactNode, useContext, useState } from 'react'

import {
  getActiveStorageBoard,
  getStorageBoards,
  saveStorageActiveBoard,
  saveStorageBoards,
} from '../storage/boardsConfig'

import { BoardDTO } from '../dtos/boardDTO'
import { toast } from 'react-toastify'
import { ColumnDTO } from '@/dtos/columnDTO'

interface BoardsContextData {
  activeBoard: BoardDTO
  allBoards: BoardDTO[]
  updateActiveBoard: (board: BoardDTO) => void
  updateBoards: (boards: BoardDTO[]) => void

  handleSetActiveBoard: (board: BoardDTO) => void

  createNewBoard: (name: string, columns: ColumnDTO[]) => void
  deleteBoard: (board: BoardDTO) => void
  editBoard: (board: BoardDTO, newName: string, newColumns: ColumnDTO[]) => void
}

const BoardsContext = createContext<BoardsContextData | undefined>(undefined)

export function useBoardsContext() {
  const context = useContext(BoardsContext)
  if (!context) {
    throw new Error(
      'useBoardsContext must be used within a BoardsContextProvider',
    )
  }
  return context
}

interface BoardsContextProviderProps {
  children: ReactNode
}

export function BoardsContextProvider({
  children,
}: BoardsContextProviderProps) {
  const [activeBoard, setActiveBoard] = useState<BoardDTO>(
    getActiveStorageBoard(),
  )

  const [allBoards, setAllBoards] = useState<BoardDTO[]>(getStorageBoards())

  function handleSetActiveBoard(board: BoardDTO) {
    saveStorageActiveBoard({
      name: board.name,
      columns: [...board.columns],
    })
    setActiveBoard({
      name: board.name,
      columns: [...board.columns],
    })
  }

  function updateActiveBoard(board: BoardDTO) {
    saveStorageActiveBoard({
      name: board.name,
      columns: [...board.columns],
    })
    setActiveBoard({
      name: board.name,
      columns: [...board.columns],
    })
  }

  function updateBoards(updatedBoards: BoardDTO[]) {
    setAllBoards(updatedBoards)
    saveStorageBoards(updatedBoards)
  }

  function createNewBoard(name: string, columns: ColumnDTO[]) {
    const newBoard: BoardDTO = {
      name,
      columns,
    }

    const existingBoard = allBoards.find(
      (existingBoard) =>
        existingBoard.name.toLowerCase() === name.toLowerCase(),
    )

    if (existingBoard) {
      toast.error('A board with this name already exists.')
      return
    }

    const updatedBoards = [...allBoards, newBoard]
    updateBoards(updatedBoards)

    updateActiveBoard(newBoard)
  }

  function deleteBoard(board: BoardDTO) {
    const updatedBoards = allBoards.filter((b) => b.name !== board.name)

    if (activeBoard && activeBoard.name === board.name) {
      updateActiveBoard(allBoards[0])
    }

    updateBoards(updatedBoards)
  }

  function editBoard(
    boardToEdit: BoardDTO,
    newName: string,
    newColumns: ColumnDTO[],
  ) {
    const boardIndex = allBoards.findIndex(
      (board) => board.name === boardToEdit.name,
    )

    if (boardIndex === -1) {
      toast.error('Board not found.')
      return
    }

    const lowerCaseColumnNames = newColumns.map((column) =>
      column.name.toLowerCase(),
    )

    const hasDuplicateNames =
      new Set(lowerCaseColumnNames).size !== newColumns.length

    if (hasDuplicateNames) {
      toast.error('This board already contains a column with this name.')
      return
    }

    const updatedBoards = [...allBoards]
    const editedBoard = updatedBoards[boardIndex]

    editedBoard.name = newName
    editedBoard.columns = newColumns

    updatedBoards[boardIndex] = editedBoard

    updateBoards(updatedBoards)

    updateActiveBoard(editedBoard)
  }

  return (
    <BoardsContext.Provider
      value={{
        activeBoard,
        allBoards,
        updateActiveBoard,
        updateBoards,
        createNewBoard,
        editBoard,
        deleteBoard,
        handleSetActiveBoard,
      }}
    >
      {children}
    </BoardsContext.Provider>
  )
}
