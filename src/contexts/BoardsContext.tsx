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
  editTask: (updatedTask: TaskDTO, taskToEdit: TaskDTO, status: string) => void
  addTaskToColumn: (task: TaskDTO, columnName: string) => void
  updateColumnsInBoard: (columns: ColumnDTO[]) => void

  createNewBoard: (name: string, columns: ColumnDTO[]) => void
  deleteBoard: (board: BoardDTO) => void
  editBoard: (board: BoardDTO, newName: string, newColumns: ColumnDTO[]) => void

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
    previousStatus: string,
  ) {
    const activeBoardIndex = findActiveBoardIndex()
    if (activeBoardIndex === -1) return

    const updatedBoards = [...allBoards]
    const activeBoardCopy = { ...updatedBoards[activeBoardIndex] }

    const sourceColumn = activeBoardCopy.columns.find(
      (column) => column.name === previousStatus,
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

    const existingTask = destinationColumn.tasks.find(
      (task) => task.title.toLowerCase() === sourceTask.title.toLowerCase(),
    )

    if (existingTask) {
      toast.error('This column already contains a task with this name.')
      return
    }

    console.log('heyt')

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

  function editTask(
    updatedTask: TaskDTO,
    taskToEdit: TaskDTO,
    previousStatus: string,
  ) {
    const boardsCopy = [...getStorageBoards()]
    const boardIndex = boardsCopy.findIndex(
      (board) => board.name === activeBoard.name,
    )

    if (boardIndex !== -1) {
      const updatedBoard = { ...boardsCopy[boardIndex] }

      const targetTaskIndex = updatedBoard.columns.findIndex(
        (column: ColumnDTO) =>
          column.tasks.some((t) => t.title === taskToEdit.title),
      )

      if (targetTaskIndex !== -1) {
        const targetTask = updatedBoard.columns[targetTaskIndex].tasks.find(
          (t: TaskDTO) => t.title === taskToEdit.title,
        )

        if (targetTask) {
          targetTask.title = updatedTask.title
          targetTask.description = updatedTask.description
          targetTask.status = updatedTask.status
          targetTask.subtasks = updatedTask.subtasks

          boardsCopy[boardIndex] = updatedBoard

          handleSetActiveBoard(updatedBoard)

          handleSetAllBoards(boardsCopy)

          saveStorageBoards(boardsCopy)

          saveStorageActiveBoard(updatedBoard)

          transferTaskToColumn(taskToEdit, updatedTask.status, previousStatus)
        }
      }
    }
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
      (existingTask) =>
        existingTask.title.toLowerCase() === task.title.toLowerCase(),
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

    const lowerCaseColumnNames = columnsToUpdate.map((column) =>
      column.name.toLowerCase(),
    )

    const hasDuplicateNames =
      new Set(lowerCaseColumnNames).size !== columnsToUpdate.length

    if (hasDuplicateNames) {
      toast.error('This board already contains a column with this name.')
      return
    }

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

    handleSetActiveBoard(newBoard)
  }

  function deleteBoard(board: BoardDTO) {
    const updatedBoards = allBoards.filter((b) => b.name !== board.name)

    if (activeBoard && activeBoard.name === board.name) {
      handleSetActiveBoard(allBoards[0])
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

    if (activeBoard && activeBoard.name === editedBoard.name) {
      handleSetActiveBoard(editedBoard)
    }
  }

  const BoardsContextValue: BoardsContextData = {
    allBoards,
    activeBoard,
    handleSetActiveBoard,
    addTaskToColumn,
    handleSetAllBoards,
    transferTaskToColumn,
    deleteTask,
    editTask,
    updateColumnsInBoard,
    createNewBoard,
    deleteBoard,
    editBoard,
  }

  return (
    <BoardsContext.Provider value={BoardsContextValue}>
      {children}
    </BoardsContext.Provider>
  )
}
