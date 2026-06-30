import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { TaskProps } from '@/@types/task'
import { BoardColumnProps } from '@/@types/board-column'
import { taskSortableId } from '@/pages/home/partials/TaskCard'

type SetColumns = Dispatch<SetStateAction<BoardColumnProps[] | undefined>>

type Id = string | number | null | undefined

const sameId = (a: Id, b: Id) => String(a) === String(b)

// dnd ids are stable strings (`task-<id>` / `column-<id>`), never array
// positions — so reordering, filtering or sorting the columns can't desync
// the drag target the way the old positional `droppableId` index did.
const rawTaskId = (dndId: string) => dndId.replace('task-', '')

export function useDragAndDrop(
  boardColumns: BoardColumnProps[] | undefined,
  setBoardColumns: SetColumns,
) {
  const { activeBoardMutate } = useBoardsContext()

  const [activeTask, setActiveTask] = useState<TaskProps | null>(null)
  const [isApiProcessing, setIsApiProcessing] = useState(false)

  // Mirror of the rendered columns so `onDragEnd` reads the latest state even
  // after `onDragOver` has moved a task across columns mid-drag.
  const columnsRef = useRef(boardColumns)
  columnsRef.current = boardColumns

  // Captured when a drag starts: the pre-drag snapshot (for rollback) and the
  // task's origin column (to pick the right endpoint: move vs reorder).
  const dragStart = useRef<{
    columns: BoardColumnProps[]
    columnId: BoardColumnProps['id']
  } | null>(null)

  const resolveColumn = (
    columns: BoardColumnProps[],
    dndId: string,
  ): BoardColumnProps | undefined => {
    if (dndId.startsWith('column-')) {
      const id = dndId.replace('column-', '')
      return columns.find((col) => sameId(col.id, id))
    }
    const taskId = rawTaskId(dndId)
    return columns.find((col) =>
      col.tasks.some((task) => sameId(task.id, taskId)),
    )
  }

  const onDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as TaskProps | undefined
    const columnId = event.active.data.current
      ?.columnId as BoardColumnProps['id']

    if (!task || !boardColumns) return

    setActiveTask(task)
    dragStart.current = { columns: boardColumns, columnId }
  }

  // Live preview: when the pointer enters a different column, move the dragged
  // task into it so the gap follows the cursor across columns.
  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)
    if (activeId === overId) return

    setBoardColumns((prev) => {
      if (!prev) return prev

      const activeColumn = resolveColumn(prev, activeId)
      const overColumn = resolveColumn(prev, overId)
      if (!activeColumn || !overColumn) return prev
      if (sameId(activeColumn.id, overColumn.id)) return prev

      const taskId = rawTaskId(activeId)
      const movingTask = activeColumn.tasks.find((t) => sameId(t.id, taskId))
      if (!movingTask) return prev

      const overIndex = overColumn.tasks.findIndex(
        (t) => taskSortableId(t.id) === overId,
      )
      const insertAt = overIndex >= 0 ? overIndex : overColumn.tasks.length

      return prev.map((col) => {
        if (sameId(col.id, activeColumn.id)) {
          return {
            ...col,
            tasks: col.tasks.filter((t) => !sameId(t.id, taskId)),
          }
        }
        if (sameId(col.id, overColumn.id)) {
          const tasks = [...col.tasks]
          tasks.splice(insertAt, 0, movingTask)
          return { ...col, tasks }
        }
        return col
      })
    })
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    const snapshot = dragStart.current
    dragStart.current = null

    const current = columnsRef.current
    if (!over || !snapshot || !current) return

    const activeId = String(active.id)
    const overId = String(over.id)
    const taskId = rawTaskId(activeId)

    const destColumn = resolveColumn(current, activeId)
    const overColumn = resolveColumn(current, overId)
    if (!destColumn || !overColumn) {
      setBoardColumns(snapshot.columns)
      return
    }

    // Final within-column reorder (the cross-column move already happened in
    // onDragOver). Only the destination column can change here.
    let columns = current
    if (sameId(destColumn.id, overColumn.id)) {
      const oldIndex = destColumn.tasks.findIndex((t) => sameId(t.id, taskId))
      const overIndex = destColumn.tasks.findIndex(
        (t) => taskSortableId(t.id) === overId,
      )
      const newIndex = overIndex >= 0 ? overIndex : destColumn.tasks.length - 1

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        columns = current.map((col) =>
          sameId(col.id, destColumn.id)
            ? { ...col, tasks: arrayMove(col.tasks, oldIndex, newIndex) }
            : col,
        )
        setBoardColumns(columns)
      }
    }

    const finalColumn = columns.find((c) => sameId(c.id, destColumn.id))
    if (!finalColumn) return

    const newOrder = finalColumn.tasks.findIndex((t) => sameId(t.id, taskId))
    const movedToNewColumn = !sameId(snapshot.columnId, destColumn.id)

    // No-op guard: dropped back where it started.
    if (!movedToNewColumn) {
      const originalOrder = snapshot.columns
        .find((c) => sameId(c.id, snapshot.columnId))
        ?.tasks.findIndex((t) => sameId(t.id, taskId))
      if (originalOrder === newOrder) return
    }

    commit({
      taskId,
      destColumnId: destColumn.id,
      newOrder,
      movedToNewColumn,
      rollback: snapshot.columns,
    })
  }

  const commit = async ({
    taskId,
    destColumnId,
    newOrder,
    movedToNewColumn,
    rollback,
  }: {
    taskId: string
    destColumnId: BoardColumnProps['id']
    newOrder: number
    movedToNewColumn: boolean
    rollback: BoardColumnProps[]
  }) => {
    setIsApiProcessing(true)
    try {
      if (movedToNewColumn) {
        await api.patch(`tasks/${taskId}/move`, {
          new_column_id: Number(destColumnId),
          new_order: newOrder,
        })
      } else {
        await api.patch(`tasks/${taskId}/reorder`, { new_order: newOrder })
      }
      await activeBoardMutate()
    } catch (error) {
      setBoardColumns(rollback)
      handleApiError(error)
    } finally {
      setIsApiProcessing(false)
    }
  }

  return {
    activeTask,
    isApiProcessing,
    onDragStart,
    onDragOver,
    onDragEnd,
  }
}
