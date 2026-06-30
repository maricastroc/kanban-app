import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useState } from 'react'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { useDragAndDrop } from './useDragAndDrop'
import { taskSortableId } from '@/pages/home/partials/TaskCard'
import { columnDroppableId } from '@/pages/home/partials/BoardColumn'
import { BoardColumnProps } from '@/@types/board-column'
import { TaskProps } from '@/@types/task'

// The hook talks to three collaborators; mock them so the suite exercises the
// drag math + optimistic-update logic in isolation, and so we can assert on the
// persistence calls (move vs reorder) and on the rollback path.
const { mockPatch, mockActiveBoardMutate, mockHandleApiError } = vi.hoisted(
  () => ({
    mockPatch: vi.fn(),
    mockActiveBoardMutate: vi.fn(),
    mockHandleApiError: vi.fn(),
  }),
)

vi.mock('@/contexts/BoardsContext', () => ({
  useBoardsContext: () => ({ activeBoardMutate: mockActiveBoardMutate }),
}))

vi.mock('@/lib/axios', () => ({ api: { patch: mockPatch } }))

vi.mock('@/utils/handleApiError', () => ({
  handleApiError: mockHandleApiError,
}))

const makeTask = (id: number): TaskProps => ({
  id,
  name: `Task ${id}`,
  status: '',
  subtasks: [],
})

// Two columns: "Todo" with tasks 1 & 2, "Doing" with task 3.
const baseColumns = (): BoardColumnProps[] => [
  { id: 1, name: 'Todo', tasks: [makeTask(1), makeTask(2)] },
  { id: 2, name: 'Doing', tasks: [makeTask(3)] },
]

// Collapse columns to `{ id, tasks: [...ids] }` so order assertions read clearly.
const shape = (columns?: BoardColumnProps[]) =>
  columns?.map((col) => ({ id: col.id, tasks: col.tasks.map((t) => t.id) }))

type DragData = Record<string, unknown>

const makeNode = (id: string, data: DragData) => ({
  id,
  data: { current: data },
})

const startTask = (task: TaskProps, columnId: BoardColumnProps['id']) =>
  ({
    active: makeNode(taskSortableId(task.id), { type: 'task', task, columnId }),
  } as unknown as DragStartEvent)

const startColumn = (column: BoardColumnProps) =>
  ({
    active: makeNode(columnDroppableId(column.id), {
      type: 'column',
      column,
      columnId: column.id,
    }),
  } as unknown as DragStartEvent)

// `over` is null when the pointer is released over no droppable.
const dragEvent = (
  activeId: string,
  activeData: DragData,
  overId: string | null,
) => ({
  active: makeNode(activeId, activeData),
  over: overId === null ? null : makeNode(overId, {}),
})

const overTask = (id: number) => taskSortableId(id)
const overColumn = (id: number) => columnDroppableId(id)

// Drive the hook through a real useState so optimistic moves (and rollbacks)
// actually update state and re-render — mirroring how the board uses it.
function setup(initial = baseColumns()) {
  return renderHook(() => {
    const [columns, setColumns] = useState<BoardColumnProps[] | undefined>(
      initial,
    )
    return { columns, ...useDragAndDrop(columns, setColumns) }
  })
}

beforeEach(() => {
  mockPatch.mockReset().mockResolvedValue({ data: {} })
  mockActiveBoardMutate.mockReset().mockResolvedValue(undefined)
  mockHandleApiError.mockReset()
})

describe('useDragAndDrop', () => {
  describe('onDragStart', () => {
    it('captures the dragged task as the active overlay item', () => {
      const { result } = setup()
      const task = result.current.columns![0].tasks[0]

      act(() => result.current.onDragStart(startTask(task, 1)))

      expect(result.current.activeTask).toEqual(task)
      expect(result.current.activeColumn).toBeNull()
    })

    it('captures the dragged column as the active overlay item', () => {
      const { result } = setup()
      const column = result.current.columns![0]

      act(() => result.current.onDragStart(startColumn(column)))

      expect(result.current.activeColumn).toEqual(column)
      expect(result.current.activeTask).toBeNull()
    })
  })

  describe('onDragOver', () => {
    it('previews a cross-column move by relocating the task into the hovered column', () => {
      const { result } = setup()

      act(() => result.current.onDragStart(startTask(makeTask(1), 1)))
      act(() =>
        result.current.onDragOver(
          dragEvent(
            overTask(1),
            { type: 'task' },
            overTask(3),
          ) as unknown as DragOverEvent,
        ),
      )

      // Task 1 leaves Todo and lands before task 3 (the hovered task) in Doing.
      expect(shape(result.current.columns)).toEqual([
        { id: 1, tasks: [2] },
        { id: 2, tasks: [1, 3] },
      ])
    })

    it('does nothing when hovering within the same column', () => {
      const { result } = setup()

      act(() => result.current.onDragStart(startTask(makeTask(1), 1)))
      act(() =>
        result.current.onDragOver(
          dragEvent(
            overTask(1),
            { type: 'task' },
            overTask(2),
          ) as unknown as DragOverEvent,
        ),
      )

      // Same-column ordering is settled in onDragEnd, not here.
      expect(shape(result.current.columns)).toEqual([
        { id: 1, tasks: [1, 2] },
        { id: 2, tasks: [3] },
      ])
    })

    it('ignores a column drag (the sortable strategy animates it)', () => {
      const { result } = setup()

      act(() =>
        result.current.onDragStart(startColumn(result.current.columns![0])),
      )
      act(() =>
        result.current.onDragOver(
          dragEvent(
            overColumn(1),
            { type: 'column' },
            overColumn(2),
          ) as unknown as DragOverEvent,
        ),
      )

      expect(shape(result.current.columns)).toEqual([
        { id: 1, tasks: [1, 2] },
        { id: 2, tasks: [3] },
      ])
    })
  })

  describe('onDragEnd (task)', () => {
    it('persists a within-column reorder via the reorder endpoint with a 1-based order', async () => {
      const { result } = setup()

      act(() => result.current.onDragStart(startTask(makeTask(1), 1)))
      await act(async () => {
        result.current.onDragEnd(
          dragEvent(
            overTask(1),
            { type: 'task' },
            overTask(2),
          ) as unknown as DragEndEvent,
        )
      })

      // Task 1 moves below task 2 → position 2 (1-based).
      expect(shape(result.current.columns)).toEqual([
        { id: 1, tasks: [2, 1] },
        { id: 2, tasks: [3] },
      ])
      expect(mockPatch).toHaveBeenCalledWith('tasks/1/reorder', {
        new_order: 2,
      })
      expect(mockActiveBoardMutate).toHaveBeenCalled()
      expect(result.current.activeTask).toBeNull()
      expect(result.current.isApiProcessing).toBe(false)
    })

    it('persists a cross-column move via the move endpoint with the new column + order', async () => {
      const { result } = setup()

      act(() => result.current.onDragStart(startTask(makeTask(1), 1)))
      // onDragOver moves task 1 into Doing first (live preview), as the real UI does.
      act(() =>
        result.current.onDragOver(
          dragEvent(
            overTask(1),
            { type: 'task' },
            overColumn(2),
          ) as unknown as DragOverEvent,
        ),
      )
      await act(async () => {
        result.current.onDragEnd(
          dragEvent(
            overTask(1),
            { type: 'task' },
            overColumn(2),
          ) as unknown as DragEndEvent,
        )
      })

      // Task 1 is appended after task 3 in Doing → column 2, position 2.
      expect(shape(result.current.columns)).toEqual([
        { id: 1, tasks: [2] },
        { id: 2, tasks: [3, 1] },
      ])
      expect(mockPatch).toHaveBeenCalledWith('tasks/1/move', {
        new_column_id: 2,
        new_order: 2,
      })
      expect(mockActiveBoardMutate).toHaveBeenCalled()
    })

    it('does not call the API when the task is dropped in its original spot', async () => {
      const { result } = setup()

      act(() => result.current.onDragStart(startTask(makeTask(1), 1)))
      await act(async () => {
        result.current.onDragEnd(
          dragEvent(
            overTask(1),
            { type: 'task' },
            overTask(1),
          ) as unknown as DragEndEvent,
        )
      })

      expect(mockPatch).not.toHaveBeenCalled()
      expect(shape(result.current.columns)).toEqual([
        { id: 1, tasks: [1, 2] },
        { id: 2, tasks: [3] },
      ])
    })

    it('does nothing when released over no droppable', async () => {
      const { result } = setup()

      act(() => result.current.onDragStart(startTask(makeTask(1), 1)))
      await act(async () => {
        result.current.onDragEnd(
          dragEvent(
            overTask(1),
            { type: 'task' },
            null,
          ) as unknown as DragEndEvent,
        )
      })

      expect(mockPatch).not.toHaveBeenCalled()
      expect(shape(result.current.columns)).toEqual([
        { id: 1, tasks: [1, 2] },
        { id: 2, tasks: [3] },
      ])
    })

    it('rolls back to the pre-drag snapshot and reports the error when the request fails', async () => {
      mockPatch.mockReset().mockRejectedValueOnce(new Error('boom'))
      const { result } = setup()

      act(() => result.current.onDragStart(startTask(makeTask(1), 1)))
      await act(async () => {
        result.current.onDragEnd(
          dragEvent(
            overTask(1),
            { type: 'task' },
            overTask(2),
          ) as unknown as DragEndEvent,
        )
      })

      // Optimistic reorder is reverted to the original order on failure.
      expect(shape(result.current.columns)).toEqual([
        { id: 1, tasks: [1, 2] },
        { id: 2, tasks: [3] },
      ])
      expect(mockHandleApiError).toHaveBeenCalled()
      expect(result.current.isApiProcessing).toBe(false)
    })
  })

  describe('onDragEnd (column)', () => {
    it('persists a column reorder via the column reorder endpoint with a 1-based order', async () => {
      const { result } = setup()
      const column = result.current.columns![0]

      act(() => result.current.onDragStart(startColumn(column)))
      await act(async () => {
        result.current.onDragEnd(
          dragEvent(
            overColumn(1),
            { type: 'column' },
            overColumn(2),
          ) as unknown as DragEndEvent,
        )
      })

      // Todo (id 1) moves after Doing (id 2) → position 2.
      expect(shape(result.current.columns)).toEqual([
        { id: 2, tasks: [3] },
        { id: 1, tasks: [1, 2] },
      ])
      expect(mockPatch).toHaveBeenCalledWith('columns/1/reorder', {
        new_order: 2,
      })
      expect(mockActiveBoardMutate).toHaveBeenCalled()
      expect(result.current.activeColumn).toBeNull()
    })

    it('rolls back the column order and reports the error when the request fails', async () => {
      mockPatch.mockReset().mockRejectedValueOnce(new Error('boom'))
      const { result } = setup()
      const column = result.current.columns![0]

      act(() => result.current.onDragStart(startColumn(column)))
      await act(async () => {
        result.current.onDragEnd(
          dragEvent(
            overColumn(1),
            { type: 'column' },
            overColumn(2),
          ) as unknown as DragEndEvent,
        )
      })

      expect(shape(result.current.columns)).toEqual([
        { id: 1, tasks: [1, 2] },
        { id: 2, tasks: [3] },
      ])
      expect(mockHandleApiError).toHaveBeenCalled()
    })
  })
})
