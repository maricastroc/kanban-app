import { createContext, ReactNode, useState } from 'react'
import {
  getActiveStorageBoard,
  getStorageBoards,
  saveStorageActiveBoard,
  saveStorageBoards,
} from '../storage/boardsConfig'
import { BoardDTO } from '../dtos/boardDTO'
import { TaskDTO } from '@/dtos/taskDTO'
import { ColumnDTO } from '@/dtos/columnDTO'
import { toast } from 'react-toastify'

interface BoardsContextData {
  activeBoard: BoardDTO
  allBoards: BoardDTO[]
  handleSetActiveBoard: (board: BoardDTO) => void
  handleSetAllBoards: (boards: BoardDTO[]) => void
  deleteTask: (task: TaskDTO) => void
  addTaskToColumn: (task: TaskDTO, columnName: string) => void
  updateColumnsInBoard: (columns: ColumnDTO[]) => void
  createNewBoard: (name: string, columns: ColumnDTO[]) => void
  deleteBoard: (board: BoardDTO) => void
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
    getActiveStorageBoard(),
  )

  const [allBoards, setAllBoards] = useState<BoardDTO[]>(getStorageBoards())

  function handleSetActiveBoard(board: BoardDTO) {
    setActiveBoard(board)
    saveStorageActiveBoard(board)
  }

  function handleSetAllBoards(boards: BoardDTO[]) {
    setAllBoards(boards)
  }

  function updateBoards(updatedBoards: BoardDTO[]) {
    handleSetAllBoards(updatedBoards)
    saveStorageBoards(updatedBoards)
  }

  function findActiveBoardIndex() {
    return allBoards.findIndex((board) => board.name === activeBoard.name)
  }

  function transferTaskToColumn(
    selectedTask: TaskDTO,
    destinationColumnName: string,
    status: string,
  ) {
    const activeBoardIndex = findActiveBoardIndex()
    if (activeBoardIndex === -1) return

    const updatedBoards = [...allBoards]
    const activeBoardCopy = { ...updatedBoards[activeBoardIndex] }

    const sourceColumn = activeBoardCopy.columns.find(
      (column) => column.name === status,
    )

    if (!sourceColumn) return

    const taskIndex = sourceColumn.tasks.findIndex(
      (task) => task.title === selectedTask.title,
    )

    if (taskIndex === -1) return

    const sourceTask = sourceColumn.tasks[taskIndex]
    sourceTask.status = destinationColumnName
    sourceColumn.tasks.splice(taskIndex, 1)

    const destinationColumn = activeBoardCopy.columns.find(
      (column) => column.name === destinationColumnName,
    )

    if (!destinationColumn) return

    destinationColumn.tasks.push(sourceTask)
    updatedBoards[activeBoardIndex] = activeBoardCopy
    updateBoards(updatedBoards)
    handleSetActiveBoard(activeBoardCopy)
  }

  function deleteTask(task: TaskDTO) {
    const activeBoardIndex = findActiveBoardIndex()
    if (activeBoardIndex === -1) return

    const updatedBoards = [...allBoards]
    const activeBoardCopy = { ...updatedBoards[activeBoardIndex] }

    activeBoardCopy.columns.forEach((column) => {
      const taskIndex = column.tasks.findIndex((t) => t.title === task.title)
      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1)
      }
    })

    updatedBoards[activeBoardIndex] = activeBoardCopy
    updateBoards(updatedBoards)
    handleSetActiveBoard(activeBoardCopy)
  }

  function addTaskToColumn(task: TaskDTO, columnName: string) {
    const activeBoardIndex = findActiveBoardIndex()
    if (activeBoardIndex === -1) return

    const updatedBoards = [...allBoards]
    const activeBoardCopy = { ...updatedBoards[activeBoardIndex] }

    const destinationColumn = activeBoardCopy.columns.find(
      (column) => column.name === columnName,
    )

    if (!destinationColumn) return

    const existingTask = destinationColumn.tasks.find(
      (existingTask) => existingTask.title === task.title,
    )

    if (existingTask) {
      toast.error('This column already contains a task with this name.')
    } else {
      destinationColumn.tasks.push(task)
      updatedBoards[activeBoardIndex] = activeBoardCopy
      updateBoards(updatedBoards)
      handleSetActiveBoard(activeBoardCopy)
    }
  }

  function updateColumnsInBoard(columnsToUpdate: ColumnDTO[]) {
    const activeBoardIndex = findActiveBoardIndex()
    if (activeBoardIndex === -1) return

    const updatedBoards = [...allBoards]
    const activeBoardCopy = { ...updatedBoards[activeBoardIndex] }

    columnsToUpdate.forEach((columnToUpdate) => {
      const existingColumnIndex = activeBoardCopy.columns.findIndex(
        (column) => column.name === columnToUpdate.name,
      )

      if (existingColumnIndex !== -1) {
        activeBoardCopy.columns[existingColumnIndex].tasks =
          columnToUpdate.tasks || []
      } else {
        activeBoardCopy.columns.push({
          name: columnToUpdate.name,
          tasks: columnToUpdate.tasks || [],
        })
      }
    })

    activeBoardCopy.columns = activeBoardCopy.columns.filter((column) =>
      columnsToUpdate.some(
        (columnToUpdate) => columnToUpdate.name === column.name,
      ),
    )

    updatedBoards[activeBoardIndex] = activeBoardCopy
    updateBoards(updatedBoards)
    handleSetActiveBoard(activeBoardCopy)
  }

  function createNewBoard(name: string, columns: ColumnDTO[]) {
    const newBoard: BoardDTO = {
      name,
      columns,
    }

    const updatedBoards = [...allBoards, newBoard]
    updateBoards(updatedBoards)

    handleSetActiveBoard(newBoard)
  }

  function deleteBoard(board: BoardDTO) {
    const updatedBoards = allBoards.filter((b) => b.name !== board.name)

    if (activeBoard && activeBoard.name === board.name) {
      handleSetActiveBoard(allBoards[0])
    }

    updateBoards(updatedBoards)
  }

  const BoardsContextValue: BoardsContextData = {
    allBoards,
    activeBoard,
    handleSetActiveBoard,
    addTaskToColumn,
    handleSetAllBoards,
    transferTaskToColumn,
    deleteTask,
    updateColumnsInBoard,
    createNewBoard,
    deleteBoard,
  }

  return (
    <BoardsContext.Provider value={BoardsContextValue}>
      {children}
    </BoardsContext.Provider>
  )
}
