import { createContext, ReactNode, useContext } from 'react'
import { toast } from 'react-toastify'

import { useBoardsContext } from './BoardsContext'
import { getStorageBoards } from '@/storage/boardsConfig'
import { TaskProps } from '@/@types/task'
import { BoardColumnProps } from '@/@types/board-column'

interface TaskContextData {
  deleteTask: (task: TaskProps) => void
  editTask: (updatedTask: TaskProps, originalTask: TaskProps) => void
  addTaskToColumn: (task: TaskProps, columnName: string | undefined) => void
  updateBoardColumns: (updatedColumns: BoardColumnProps[]) => void
  moveTaskToColumn: (
    task: TaskProps,
    targetColumn: string,
    previousColumn: string,
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
  const { activeBoard, allBoards, handleSetActiveBoard, updateBoards } =
    useBoardsContext()

  function findActiveBoardIndex() {
    return allBoards.findIndex((board) => board.name === activeBoard?.name)
  }

  function moveTaskToColumn(
    task: TaskProps,
    targetColumnName: string,
    previousColumnName: string,
  ) {
    const boardIndex = findActiveBoardIndex()
    if (boardIndex === -1) return

    const boardsCopy = [...allBoards]
    const boardCopy = { ...boardsCopy[boardIndex] }

    const sourceColumn = boardCopy?.columns?.find(
      (column) => column.name === previousColumnName,
    )
    if (!sourceColumn) return

    const taskIndex = sourceColumn.tasks.findIndex(
      (t) => t.title === task.title,
    )

    if (taskIndex === -1) return

    const taskToMove = sourceColumn.tasks[taskIndex]
    taskToMove.status = targetColumnName
    sourceColumn.tasks.splice(taskIndex, 1)

    const targetColumn = boardCopy?.columns?.find(
      (column) => column.name === targetColumnName,
    ) 

    if (!targetColumn) return

    const isTaskDuplicate = targetColumn.tasks.some(
      (t) => t.title === taskToMove.title,
    )
    if (isTaskDuplicate) {
      toast.error('This column already contains a task with this name.')
      return
    }

    targetColumn.tasks.push(taskToMove)
    boardsCopy[boardIndex] = boardCopy
    updateBoards(boardsCopy)
    handleSetActiveBoard(boardCopy)
  }

  function deleteTask(task: TaskProps) {
    const boardIndex = findActiveBoardIndex()
    if (boardIndex === -1) return

    const boardsCopy = [...allBoards]
    const boardCopy = { ...boardsCopy[boardIndex] }

    boardCopy.columns.forEach((column) => {
      const taskIndex = column.tasks.findIndex((t) => t.title === task.title)
      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1)
      }
    })

    boardsCopy[boardIndex] = boardCopy
    updateBoards(boardsCopy)
    handleSetActiveBoard(boardCopy)
  }

  function editTask(updatedTask: TaskProps, originalTask: TaskProps) {
    const boardsCopy = [...getStorageBoards()]
    const boardIndex = boardsCopy.findIndex(
      (board) => board.name === activeBoard?.name,
    )

    if (boardIndex !== -1) {
      const boardCopy = { ...boardsCopy[boardIndex] }

      const columnIndex = boardCopy.columns.findIndex(
        (column: BoardColumnProps) =>
          column.tasks.some(
            (task: TaskProps) => task.title === originalTask.title,
          ),
      )

      if (columnIndex !== -1) {
        const column = boardCopy.columns[columnIndex]
        const isDuplicateTask = column.tasks.some(
          (task: TaskProps) =>
            task.title === updatedTask.title &&
            updatedTask.title !== originalTask.title,
        )

        if (isDuplicateTask) {
          toast.error('This column already contains a task with this name.')
          return
        }

        const taskToEdit = column.tasks.find(
          (task: TaskProps) => task.title === originalTask.title,
        )
        if (taskToEdit) {
          taskToEdit.title = updatedTask.title
          taskToEdit.description = updatedTask.description
          taskToEdit.subtasks = updatedTask.subtasks

          boardsCopy[boardIndex] = boardCopy
          updateBoards(boardsCopy)
          handleSetActiveBoard(boardCopy)
        }
      }
    }
  }

  function addTaskToColumn(task: TaskProps, columnName: string | undefined) {
    const boardIndex = findActiveBoardIndex()
    if (boardIndex === -1) return

    const boardsCopy = [...allBoards]
    const boardCopy = { ...boardsCopy[boardIndex] }

    const column = boardCopy.columns.find((col) => col.name === columnName)
    if (!column) return

    const isDuplicateTask = column.tasks.some(
      (existingTask) =>
        existingTask.title.toLowerCase() === task.title.toLowerCase(),
    )

    if (isDuplicateTask) {
      toast.error('This column already contains a task with this name.')
      return
    }

    column.tasks.push(task)
    boardsCopy[boardIndex] = boardCopy
    updateBoards(boardsCopy)
    handleSetActiveBoard(boardCopy)
  }

  function updateBoardColumns(updatedColumns: BoardColumnProps[]) {
    const boardIndex = findActiveBoardIndex()
    if (boardIndex === -1) return

    const boardsCopy = [...allBoards]
    const boardCopy = { ...boardsCopy[boardIndex] }

    const columnNames = updatedColumns.map((column) =>
      column.name.toLowerCase(),
    )
    
    const hasDuplicateColumns =
      new Set(columnNames).size !== updatedColumns.length

    if (hasDuplicateColumns) {
      toast.error('This board already contains a column with this name.')
      return
    }

    updatedColumns.forEach((columnToUpdate) => {
      const columnIndex = boardCopy.columns.findIndex(
        (column) => column.name === columnToUpdate.name,
      )

      if (columnIndex !== -1) {
        boardCopy.columns[columnIndex].tasks = columnToUpdate.tasks || []
      } else {
        boardCopy.columns.push({
          name: columnToUpdate.name,
          tasks: columnToUpdate.tasks || [],
        })
      }
    })

    boardCopy.columns = boardCopy.columns.filter((column) =>
      updatedColumns.some(
        (columnToUpdate) => columnToUpdate.name === column.name,
      ),
    )

    boardsCopy[boardIndex] = boardCopy
    updateBoards(boardsCopy)
    handleSetActiveBoard(boardCopy)
  }

  return (
    <TaskContext.Provider
      value={{
        deleteTask,
        editTask,
        addTaskToColumn,
        moveTaskToColumn,
        updateBoardColumns,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
