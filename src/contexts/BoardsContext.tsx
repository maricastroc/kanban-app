import { BoardDTO } from '../dtos/boardDTO'
import { createContext, ReactNode, useState } from 'react'
import {
  getFirstStorageBoard,
  getStorageBoards,
  saveStorageBoards,
} from '../storage/boardsConfig'
import { ColumnDTO } from '@/dtos/columnDTO'
import { TaskDTO } from '@/dtos/taskDTO'

interface BoardsContextData {
  activeBoard: BoardDTO
  allBoards: BoardDTO[]
  handleSetActiveBoard: (board: BoardDTO) => void
  handleSetAllBoards: (boards: BoardDTO[]) => void
  transferTaskToColumn: (
    selectedTask: TaskDTO,
    destinationColumn: string,
    status: string,
  ) => void
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

  function transferTaskToColumn(
    selectedTask: TaskDTO,
    destinationColumnName: string,
    status: string,
  ) {
    const updatedBoards = [...allBoards]
    const activeBoardIndex = updatedBoards.findIndex(
      (board) => board.name === activeBoard.name,
    )

    if (activeBoardIndex !== -1) {
      const activeBoardCopy = { ...updatedBoards[activeBoardIndex] }

      const sourceColumnIndex = activeBoardCopy.columns.findIndex(
        (column: ColumnDTO) => column.name === status,
      )

      if (sourceColumnIndex !== -1) {
        const sourceColumn = activeBoardCopy.columns[sourceColumnIndex]
        const taskIndex = sourceColumn.tasks.findIndex(
          (task: TaskDTO) => task.title === selectedTask.title,
        )

        if (taskIndex !== -1) {
          const sourceTask = sourceColumn.tasks[taskIndex]

          sourceTask.status = destinationColumnName

          sourceColumn.tasks.splice(taskIndex, 1)

          const destinationColumnIndex = activeBoardCopy.columns.findIndex(
            (column: ColumnDTO) => column.name === destinationColumnName,
          )

          if (destinationColumnIndex !== -1) {
            const destinationColumn =
              activeBoardCopy.columns[destinationColumnIndex]
            destinationColumn.tasks.push(selectedTask)
            updatedBoards[activeBoardIndex] = activeBoardCopy

            handleSetAllBoards(updatedBoards)
            handleSetActiveBoard(activeBoardCopy)
            saveStorageBoards(updatedBoards)
          }
        }
      }
    }
  }

  const BoardsContextValue: BoardsContextData = {
    allBoards,
    activeBoard,
    handleSetActiveBoard,
    handleSetAllBoards,
    transferTaskToColumn,
  }

  return (
    <BoardsContext.Provider value={BoardsContextValue}>
      {children}
    </BoardsContext.Provider>
  )
}
