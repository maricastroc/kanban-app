import { Dispatch, SetStateAction, useRef, useState } from 'react'
import {
  closestCorners,
  CollisionDetection,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core'
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

// Columns and tasks share one DndContext. When dragging a column we must only
// collide with other columns — otherwise the inner task droppables (which
// overlap the whole panel) win and the horizontal sort can't resolve a target.
export const kanbanCollisionDetection: CollisionDetection = (args) => {
  if (args.active.data.current?.type !== 'column') return closestCorners(args)

  return closestCorners({
    ...args,
    droppableContainers: args.droppableContainers.filter(
      (container) => container.data.current?.type === 'column',
    ),
  })
}

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
  const [activeColumn, setActiveColumn] = useState<BoardColumnProps | null>(
    null,
  )
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

  // Pre-drag column snapshot, captured when a column drag starts (for rollback).
  const columnDragStart = useRef<BoardColumnProps[] | null>(null)

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
    if (!boardColumns) return

    if (event.active.data.current?.type === 'column') {
      const column = event.active.data.current?.column as
        | BoardColumnProps
        | undefined
      if (!column) return
      setActiveColumn(column)
      columnDragStart.current = boardColumns
      return
    }

    const task = event.active.data.current?.task as TaskProps | undefined
    const columnId = event.active.data.current
      ?.columnId as BoardColumnProps['id']

    if (!task) return

    setActiveTask(task)
    dragStart.current = { columns: boardColumns, columnId }
  }

  // Live preview: when the pointer enters a different column, move the dragged
  // task into it so the gap follows the cursor across columns.
  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    // Columns are a single horizontal list — the sortable strategy animates the
    // shift on its own, so there's no live cross-container move to mirror here.
    if (active.data.current?.type === 'column') return

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

    if (active.data.current?.type === 'column') {
      onColumnDragEnd(active, over)
      return
    }

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

    // 0-based position in the rendered list; the API orders tasks 1-based.
    const newIndex = finalColumn.tasks.findIndex((t) => sameId(t.id, taskId))
    const movedToNewColumn = !sameId(snapshot.columnId, destColumn.id)

    // No-op guard: dropped back where it started.
    if (!movedToNewColumn) {
      const originalIndex = snapshot.columns
        .find((c) => sameId(c.id, snapshot.columnId))
        ?.tasks.findIndex((t) => sameId(t.id, taskId))
      if (originalIndex === newIndex) return
    }

    commit({
      taskId,
      destColumnId: destColumn.id,
      newOrder: newIndex + 1,
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

  // Single-list horizontal reorder: the final index is the only thing that
  // changed, so we read it off the post-drag array and persist it 1-based.
  const onColumnDragEnd = (
    active: DragEndEvent['active'],
    over: DragEndEvent['over'],
  ) => {
    setActiveColumn(null)

    const snapshot = columnDragStart.current
    columnDragStart.current = null

    const current = columnsRef.current
    if (!over || !snapshot || !current) return

    // `over` may resolve to a column or to a task inside one — both map back to
    // the owning column.
    const draggedColumn = resolveColumn(current, String(active.id))
    const targetColumn = resolveColumn(current, String(over.id))
    if (!draggedColumn || !targetColumn) return

    const oldIndex = current.findIndex((c) => sameId(c.id, draggedColumn.id))
    const newIndex = current.findIndex((c) => sameId(c.id, targetColumn.id))
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

    setBoardColumns(arrayMove(current, oldIndex, newIndex))

    commitColumn({
      columnId: draggedColumn.id,
      newOrder: newIndex + 1,
      rollback: snapshot,
    })
  }

  const commitColumn = async ({
    columnId,
    newOrder,
    rollback,
  }: {
    columnId: BoardColumnProps['id']
    newOrder: number
    rollback: BoardColumnProps[]
  }) => {
    setIsApiProcessing(true)
    try {
      await api.patch(`columns/${columnId}/reorder`, { new_order: newOrder })
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
    activeColumn,
    isApiProcessing,
    onDragStart,
    onDragOver,
    onDragEnd,
  }
}
