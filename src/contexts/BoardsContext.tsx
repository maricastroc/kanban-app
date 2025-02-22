import { createContext, ReactNode, useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

import { BoardColumnProps } from '@/@types/board-column'
import { BoardProps } from '@/@types/board'
import {
  getActiveStorageBoard,
  getStorageBoards,
  saveStorageActiveBoard,
  saveStorageBoards,
} from '@/storage/boardsConfig'
import { getStorageTheme, saveStorageTheme } from '@/storage/themeConfig'

interface BoardsContextData {
  enableScrollFeature: boolean
  handleEnableScrollFeature: (value: boolean) => void

  enableDarkMode: boolean
  handleEnableDarkMode: (value: boolean) => void

  activeBoard: BoardProps | null
  allBoards: BoardProps[]
  updateBoards: (boards: BoardProps[]) => void

  handleSetActiveBoard: (board: BoardProps) => void

  createNewBoard: (name: string, columns: BoardColumnProps[]) => void
  deleteBoard: (board: BoardProps | undefined) => void
  editBoard: (
    board: BoardProps,
    newName: string,
    newColumns: BoardColumnProps[],
  ) => void

  isLoading: boolean,
  handleSetIsLoading: (value: boolean) => void,
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
  const activeTheme = getStorageTheme()

  const [enableDarkMode, setEnableDarkMode] = useState(
    activeTheme === 'DARK_THEME',
  )

  const [activeBoard, setActiveBoard] = useState<BoardProps | null>(
    getActiveStorageBoard(),
  )

  const [isLoading, setIsLoading] = useState(false)

  const [enableScrollFeature, setEnableScrollFeature] = useState(false)

  const [allBoards, setAllBoards] = useState<BoardProps[]>(getStorageBoards())

  function handleEnableScrollFeature(value: boolean) {
    setEnableScrollFeature(value)
  }

  function handleEnableDarkMode() {
    setEnableDarkMode(!enableDarkMode)
    saveStorageTheme(enableDarkMode ? 'LIGHT_THEME' : 'DARK_THEME')
  }

  function handleSetIsLoading(value: boolean) {
    setIsLoading(value)
  }

  function saveActiveBoard(board: BoardProps) {
    saveStorageActiveBoard({
      id: board.id,
      name: board.name,
      columns: [...board.columns],
    })
    setActiveBoard({
      id: board.id,
      name: board.name,
      columns: [...board.columns],
    })
  }

  function handleSetActiveBoard(board: BoardProps) {
    saveActiveBoard(board)
  }

  function updateBoards(updatedBoards: BoardProps[]) {
    setAllBoards(updatedBoards)
    saveStorageBoards(updatedBoards)
  }

  function nameExistsInBoards(
    name: string,
    boards: BoardProps[],
    excludeBoard?: BoardProps,
  ): boolean {
    return boards.some(
      (board) =>
        board.name.toLowerCase() === name.toLowerCase() &&
        (!excludeBoard || board.name !== excludeBoard.name),
    )
  }

  function createNewBoard(name: string, columns: BoardColumnProps[]) {
    const newBoard: BoardProps = {
      id: uuidv4(),
      name,
      columns,
    }

    if (nameExistsInBoards(name, allBoards)) {
      toast.error('A board with this name already exists.')
      return
    }

    if (!name.trim()) {
      toast.error('Board name cannot be empty.')
      return
    }

    if (columns.length === 0) {
      toast.error('Board must have at least one column.')
      return
    }

    toast.success('Board successfully created!')

    const updatedBoards = [...allBoards, newBoard]
    updateBoards(updatedBoards)
    handleSetActiveBoard(newBoard)
  }

  function editBoard(
    boardToEdit: BoardProps,
    newName: string,
    newColumns: BoardColumnProps[],
  ) {
    if (!newName.trim()) {
      toast.error('Board name cannot be empty.')
      return
    }

    if (newColumns.length === 0) {
      toast.error('Board must have at least one column.')
      return
    }

    const boardIndex = allBoards.findIndex(
      (board) => board.name === boardToEdit.name,
    )

    if (boardIndex === -1) {
      toast.error('Board not found.')
      return
    }

    if (nameExistsInBoards(newName, allBoards, boardToEdit)) {
      toast.error('A board with this name already exists.')
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
    handleSetActiveBoard(editedBoard)

    toast.success('Board successfully edited!')
  }

  function deleteBoard(board: BoardProps | undefined) {
    if (board === undefined) {
      return
    }

    const updatedBoards = allBoards.filter((b) => b.name !== board.name)

    if (activeBoard && activeBoard.name === board.name) {
      if (allBoards.length > 1) {
        handleSetActiveBoard(allBoards[0])
      } else {
        setActiveBoard(null)
      }
    }

    toast.success('Board successfully deleted!')

    updateBoards(updatedBoards)
  }

  return (
    <BoardsContext.Provider
      value={{
        enableScrollFeature,
        handleEnableScrollFeature,
        enableDarkMode,
        handleEnableDarkMode,
        activeBoard,
        allBoards,
        updateBoards,
        createNewBoard,
        editBoard,
        deleteBoard,
        handleSetActiveBoard,
        isLoading,
        handleSetIsLoading
      }}
    >
      {children}
    </BoardsContext.Provider>
  )
}
