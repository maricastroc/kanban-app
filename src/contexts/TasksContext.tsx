import { createContext, ReactNode, useContext } from 'react'
import { toast } from 'react-toastify'

import { useBoardsContext } from './BoardsContext'
import { getStorageBoards } from '@/storage/boardsConfig'
import { TaskProps } from '@/@types/task'
import { BoardColumnProps } from '@/@types/board-column'
import { SubtaskProps } from '@/@types/subtask'

interface TaskContextData {
  deleteTask: (task: TaskProps | undefined) => void
  editTask: (
    updatedTask: TaskProps,
    originalTask: TaskProps | undefined,
  ) => void
  addTaskToColumn: (task: TaskProps, columnName: string | undefined) => void
  reorderTasksInColumn: (columnIndex: number, newOrder: TaskProps[]) => void
  reorderSubtasks: (taskId: string, newOrder: SubtaskProps[]) => void
  updateBoardColumns: (updatedColumns: BoardColumnProps[]) => void
  moveTaskToColumn: (
    task: TaskProps,
    targetColumn: string,
    previousColumn: string,
    destinationIndex?: number,
  ) => void
  toggleSubtaskStatus: (
    task: TaskProps,
    subtaskId: string,
    status: boolean,
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
    destinationIndex?: number,
  ) {
    const boardIndex = findActiveBoardIndex()
    if (boardIndex === -1) return

    const boardsCopy = [...allBoards]
    const boardCopy = { ...boardsCopy[boardIndex] }

    const sourceColumn = boardCopy?.columns?.find(
      (column) => column.name === previousColumnName,
    )
    if (!sourceColumn) return

    const taskIndex = sourceColumn.tasks.findIndex((t) => t.id === task.id)

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

    const targetIndex = destinationIndex ?? targetColumn.tasks.length

    targetColumn.tasks.splice(targetIndex, 0, taskToMove)

    boardsCopy[boardIndex] = boardCopy

    updateBoards(boardsCopy)
    handleSetActiveBoard(boardCopy)
  }

  function deleteTask(task: TaskProps | undefined) {
    if (task === undefined) {
      return
    }
    const boardIndex = findActiveBoardIndex()
    if (boardIndex === -1) return

    const boardsCopy = [...allBoards]
    const boardCopy = { ...boardsCopy[boardIndex] }

    boardCopy.columns.forEach((column) => {
      const taskIndex = column.tasks.findIndex((t) => t.id === task.id)
      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1)
      }
    })

    boardsCopy[boardIndex] = boardCopy
    updateBoards(boardsCopy)
    handleSetActiveBoard(boardCopy)
    toast.success('Task successfully deleted!')
  }

  function editTask(
    updatedTask: TaskProps,
    originalTask: TaskProps | undefined,
  ) {
    if (originalTask === undefined) {
      return
    }

    const boardsCopy = [...getStorageBoards()]
    const boardIndex = boardsCopy.findIndex(
      (board) => board.name === activeBoard?.name,
    )

    if (boardIndex !== -1) {
      const boardCopy = { ...boardsCopy[boardIndex] }

      const columnIndex = boardCopy.columns.findIndex(
        (column: BoardColumnProps) =>
          column.tasks.some((task: TaskProps) => task.id === originalTask.id),
      )

      if (columnIndex !== -1) {
        const column = boardCopy.columns[columnIndex]
        const isDuplicateTask = column.tasks.some(
          (task: TaskProps) =>
            task.id !== originalTask.id && task.title === updatedTask.title,
        )

        if (isDuplicateTask) {
          toast.error('This column already contains a task with this name.')
          return
        }

        const taskToEdit = column.tasks.find(
          (task: TaskProps) => task.id === originalTask.id,
        )
        if (taskToEdit) {
          taskToEdit.title = updatedTask.title
          taskToEdit.description = updatedTask.description
          taskToEdit.subtasks = updatedTask.subtasks

          toast.success('Task successfully edited!')

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
      (existingTask) => existingTask.title === task.title,
    )

    if (isDuplicateTask) {
      toast.error('This column already contains a task with this name.')
      return
    }

    toast.success('Task successfully created!')

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
          id: columnToUpdate.id,
          name: columnToUpdate.name,
          tasks: columnToUpdate.tasks || [],
        })
      }
    })

    boardCopy.columns = boardCopy.columns.filter((column) =>
      updatedColumns.some((columnToUpdate) => columnToUpdate.id === column.id),
    )

    boardsCopy[boardIndex] = boardCopy
    updateBoards(boardsCopy)
    handleSetActiveBoard(boardCopy)
  }

  function toggleSubtaskStatus(
    task: TaskProps,
    subtaskId: string,
    isChecked: boolean,
  ) {
    const boardsCopy = [...allBoards]
    const boardIndex = boardsCopy.findIndex(
      (board) => board.name === activeBoard?.name,
    )

    if (boardIndex !== -1) {
      const updatedBoard = { ...boardsCopy[boardIndex] }

      const targetTaskIndex = updatedBoard.columns.findIndex(
        (column: BoardColumnProps) =>
          column.tasks.some((t) => t.id === task.id),
      )

      if (targetTaskIndex !== -1) {
        const targetTask = updatedBoard.columns[targetTaskIndex].tasks.find(
          (t: TaskProps) => t.id === task.id,
        )

        if (targetTask) {
          const targetSubtask = targetTask.subtasks.find(
            (subtask: SubtaskProps) => subtask.id === subtaskId,
          )

          if (targetSubtask) {
            targetSubtask.isCompleted = isChecked
            boardsCopy[boardIndex] = updatedBoard

            updateBoardColumns(updatedBoard.columns)
            updateBoards(boardsCopy)
          }
        }
      }
    }
  }

  function reorderTasksInColumn(columnIndex: number, newOrder: TaskProps[]) {
    const boardIndex = findActiveBoardIndex()
    if (boardIndex === -1) return

    const boardsCopy = [...allBoards]
    const boardCopy = { ...boardsCopy[boardIndex] }

    const column = boardCopy.columns[columnIndex]
    if (!column) return

    column.tasks = newOrder

    boardsCopy[boardIndex] = boardCopy

    updateBoards(boardsCopy)
    handleSetActiveBoard(boardCopy)
  }

  function reorderSubtasks(taskId: string, newOrder: SubtaskProps[]) {
    const boardIndex = findActiveBoardIndex()
    if (boardIndex === -1) return

    const boardsCopy = [...allBoards]
    const boardCopy = { ...boardsCopy[boardIndex] }

    const column = boardCopy.columns.find((col) =>
      col.tasks.some((task) => task.id === taskId),
    )
    if (!column) return

    const task = column.tasks.find((t) => t.id === taskId)
    if (!task) return

    task.subtasks = newOrder

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
        toggleSubtaskStatus,
        reorderTasksInColumn,
        reorderSubtasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
