import { createContext, ReactNode, useContext } from 'react'
import { toast } from 'react-toastify'

import { BoardDTO } from '../dtos/boardDTO'
import { TaskDTO } from '@/dtos/taskDTO'
import { ColumnDTO } from '@/dtos/columnDTO'

import { useBoardsContext } from './BoardsContext'
import { getStorageBoards } from '@/storage/boardsConfig'

interface TaskContextData {
  deleteTask: (task: TaskDTO) => void
  editTask: (updatedTask: TaskDTO, taskToEdit: TaskDTO) => void
  addTaskToColumn: (task: TaskDTO, columnName: string) => void

  updateColumnsInBoard: (columns: ColumnDTO[]) => void

  transferTaskToColumn: (
    selectedTask: TaskDTO,
    destinationColumn: string,
    status: string,
  ) => void
}

const TaskContext = createContext<TaskContextData | undefined>(undefined)

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskContextProvider')
  }
  return context
}

interface TaskContextProviderProps {
  children: ReactNode
}

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const { activeBoard, allBoards, updateActiveBoard, updateBoards } =
    useBoardsContext()

  function findActiveBoardIndex() {
    return allBoards.findIndex((board) => board.name === activeBoard.name)
  }

  function transferTaskToColumn(
    selectedTask: TaskDTO,
    destinationColumnName: string,
    previousStatus: string,
    updatedAllBoards: BoardDTO[] = allBoards,
    updatedBoard = activeBoard,
  ) {
    const activeBoardIndex = findActiveBoardIndex()
    if (activeBoardIndex === -1) return

    const updatedBoards = [...updatedAllBoards]
    const activeBoardCopy = { ...updatedBoard }

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

    const existingTask = destinationColumn.tasks.find((task) => {
      return task?.title === sourceTask?.title
    })

    if (existingTask) {
      toast.error('This column already contains a task with this name.')
      return
    }

    destinationColumn.tasks.push(sourceTask)
    updatedBoards[activeBoardIndex] = activeBoardCopy
    updateBoards(updatedBoards)
    updateActiveBoard(activeBoardCopy)
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
    updateActiveBoard(activeBoardCopy)
  }

  function editTask(updatedTask: TaskDTO, taskToEdit: TaskDTO) {
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
        const targetColumn = updatedBoard.columns[targetTaskIndex]

        const existingTaskWithSameName = targetColumn.tasks.find(
          (t: TaskDTO) => t?.title === updatedTask?.title,
        )

        if (
          existingTaskWithSameName &&
          updatedTask.title !== taskToEdit.title
        ) {
          toast.error('This column already contains a task with this name.')
          return
        }

        const targetTask = targetColumn.tasks.find(
          (t: TaskDTO) => t.title === taskToEdit.title,
        )

        if (targetTask) {
          targetTask.title = updatedTask.title
          targetTask.description = updatedTask.description
          targetTask.subtasks = updatedTask.subtasks

          boardsCopy[boardIndex] = updatedBoard

          updateBoards(boardsCopy)
          updateActiveBoard(boardsCopy[boardIndex])
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
      updateActiveBoard(activeBoardCopy)
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
    updateActiveBoard(activeBoardCopy)
  }

  return (
    <TaskContext.Provider
      value={{
        deleteTask,
        editTask,
        addTaskToColumn,
        transferTaskToColumn,
        updateColumnsInBoard,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
