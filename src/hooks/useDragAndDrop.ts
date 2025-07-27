import { useState } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { TaskProps } from '@/@types/task'
import { BoardColumnProps } from '@/@types/board-column'

export function useDragAndDrop(
  setBoardColumns: (cols: BoardColumnProps[]) => void,
) {
  const { activeBoard, activeBoardMutate, isValidatingActiveBoard } =
    useBoardsContext()

  const [isApiProcessing, setIsApiProcessing] = useState(false)

  const moveTaskToColumn = async (
    task: TaskProps,
    newColumnId: string,
    newOrder: number,
  ) => {
    setIsApiProcessing(true)

    if (!activeBoard) {
      return
    }

    const originalColumns = [...activeBoard.columns]

    try {
      if (
        isValidatingActiveBoard ||
        isApiProcessing ||
        !task?.id ||
        !newColumnId
      ) {
        return
      }

      const sourceColumnIndex = originalColumns.findIndex((col) =>
        col.tasks.some((t) => String(t.id) === String(task.id)),
      )
      const destinationColumnIndex = originalColumns.findIndex(
        (col) => String(col.id) === String(newColumnId),
      )

      if (sourceColumnIndex === -1 || destinationColumnIndex === -1) return

      const sourceColumn = originalColumns[sourceColumnIndex]
      const updatedSourceTasks = sourceColumn.tasks.filter(
        (t) => t.id !== task.id,
      )

      const destinationColumn = originalColumns[destinationColumnIndex]
      const updatedDestinationTasks = [...destinationColumn.tasks]
      updatedDestinationTasks.splice(newOrder, 0, task)

      const updatedColumns = [...originalColumns]
      updatedColumns[sourceColumnIndex] = {
        ...sourceColumn,
        tasks: updatedSourceTasks,
      }

      updatedColumns[destinationColumnIndex] = {
        ...destinationColumn,
        tasks: updatedDestinationTasks,
      }

      setBoardColumns(updatedColumns)

      const payload = {
        new_column_id: Number(newColumnId),
        new_order: Number(newOrder),
      }

      await api.patch(`tasks/${task?.id}/move`, payload)

      await activeBoardMutate()
    } catch (error) {
      setBoardColumns(originalColumns)
      handleApiError(error)
    } finally {
      setIsApiProcessing(false)
    }
  }

  const reorderTaskInColumn = async (task: TaskProps, newOrder: number) => {
    if (!activeBoard) return

    setIsApiProcessing(true)

    const originalColumns = [...activeBoard.columns]

    try {
      const columnIndex = originalColumns.findIndex((col) =>
        col.tasks.some((t) => t.id === task.id),
      )
      if (columnIndex === -1) return

      const column = originalColumns[columnIndex]
      const tasks = Array.from(column.tasks)

      const oldIndex = tasks.findIndex((t) => t.id === task.id)
      if (oldIndex === -1) return

      const [movedTask] = tasks.splice(oldIndex, 1)

      tasks.splice(newOrder, 0, movedTask)

      const newColumns = [...originalColumns]
      newColumns[columnIndex] = {
        ...column,
        tasks,
      }

      setBoardColumns(newColumns)

      const payload = {
        new_order: newOrder,
      }

      await api.patch(`tasks/${task.id}/reorder`, payload)

      await activeBoardMutate()
    } catch (error) {
      setBoardColumns(originalColumns)
      handleApiError(error)
    } finally {
      setIsApiProcessing(false)
    }
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (isApiProcessing) {
      return
    }

    if (!activeBoard) {
      return
    }

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return
    }

    const sourceColumnIndex = parseInt(source.droppableId, 10)
    const destinationColumnIndex = parseInt(destination.droppableId, 10)

    const sourceColumn = activeBoard?.columns[sourceColumnIndex]
    const destinationColumn = activeBoard?.columns[destinationColumnIndex]

    const newSourceTasks = Array.from(sourceColumn.tasks)
    const [movedTask] = newSourceTasks.splice(source.index, 1)

    if (sourceColumnIndex === destinationColumnIndex) {
      reorderTaskInColumn(movedTask, destination?.index)
    } else {
      moveTaskToColumn(
        movedTask,
        String(destinationColumn?.id),
        destination?.index,
      )
    }
  }

  return {
    onDragEnd,
    isApiProcessing,
  }
}
