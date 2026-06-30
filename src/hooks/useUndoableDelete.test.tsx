import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { BoardProps } from '@/@types/board'
import type { TaskProps } from '@/@types/task'
import { useUndoableDelete } from './useUndoableDelete'

const {
  deleteMock,
  patchMock,
  setBoards,
  setActiveBoard,
  boardsMutate,
  activeBoardMutate,
  state,
} = vi.hoisted(() => ({
  deleteMock: vi.fn(),
  patchMock: vi.fn(),
  setBoards: vi.fn(),
  setActiveBoard: vi.fn(),
  boardsMutate: vi.fn(),
  activeBoardMutate: vi.fn(),
  state: {
    boards: [] as BoardProps[],
    activeBoard: undefined as BoardProps | undefined,
  },
}))

vi.mock('@/lib/axios', () => ({
  api: { delete: deleteMock, patch: patchMock },
}))

// Capture the onUndo the hook hands to the toast so tests can trigger it.
let capturedOnUndo: (() => void) | undefined
vi.mock('react-hot-toast', () => ({
  toast: {
    custom: (
      factory: (t: { id: string; visible: boolean }) => {
        props: { onUndo: () => void }
      },
    ) => {
      capturedOnUndo = factory({ id: 'undo', visible: true }).props.onUndo
      return 'undo'
    },
    dismiss: vi.fn(),
  },
}))

vi.mock('@/contexts/BoardsContext', () => ({
  useBoardsContext: () => ({
    boards: state.boards,
    activeBoard: state.activeBoard,
    setBoards,
    setActiveBoard,
    boardsMutate,
    activeBoardMutate,
  }),
}))

const task: TaskProps = {
  id: 'task-9',
  name: 'Write docs',
  status: 'Todo',
  subtasks: [],
}
const otherTask: TaskProps = {
  id: 'task-7',
  name: 'Keep me',
  status: 'Todo',
  subtasks: [],
}
const board: BoardProps = {
  id: 'board-1',
  name: 'Marketing',
  columns: [{ id: 'col-1', name: 'Todo', tasks: [task, otherTask] }],
}

describe('useUndoableDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    capturedOnUndo = undefined
    state.boards = [board, { id: 'board-2', name: 'Sales', columns: [] }]
    state.activeBoard = board
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('task', () => {
    it('optimistically removes the task, then deletes after the undo window', () => {
      deleteMock.mockResolvedValue({})
      const { result } = renderHook(() => useUndoableDelete())

      act(() => result.current.deleteWithUndo({ type: 'task', task }))

      const next = setActiveBoard.mock.calls[0][0] as BoardProps
      expect(next.columns[0].tasks.map((t) => t.id)).toEqual(['task-7'])
      expect(deleteMock).not.toHaveBeenCalled()

      act(() => {
        vi.advanceTimersByTime(5000)
      })
      expect(deleteMock).toHaveBeenCalledWith('/tasks/task-9')
    })

    it('cancels the delete and restores the board when undone', () => {
      const { result } = renderHook(() => useUndoableDelete())
      act(() => result.current.deleteWithUndo({ type: 'task', task }))

      act(() => capturedOnUndo?.())

      expect(setActiveBoard).toHaveBeenLastCalledWith(board)

      act(() => {
        vi.advanceTimersByTime(5000)
      })
      expect(deleteMock).not.toHaveBeenCalled()
    })
  })

  describe('board', () => {
    it('optimistically drops the board, then deletes after the undo window', () => {
      deleteMock.mockResolvedValue({})
      const { result } = renderHook(() => useUndoableDelete())

      act(() => result.current.deleteWithUndo({ type: 'board' }))

      const remaining = setBoards.mock.calls[0][0] as BoardProps[]
      expect(remaining.map((b) => b.id)).toEqual(['board-2'])
      expect(setActiveBoard).toHaveBeenCalledWith(undefined)
      expect(deleteMock).not.toHaveBeenCalled()

      act(() => {
        vi.advanceTimersByTime(5000)
      })
      expect(deleteMock).toHaveBeenCalledWith('/boards/board-1')
    })
  })
})
