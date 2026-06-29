import type { ReactElement } from 'react'
import type { TaskProps } from '@/@types/task'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import * as Dialog from '@radix-ui/react-dialog'
import { darkTheme } from '@/styles/themes/dark'
import { DeleteModal } from './index'

const {
  deleteMock,
  toastSuccess,
  toastError,
  boardsMutate,
  activeBoardMutate,
} = vi.hoisted(() => ({
  deleteMock: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  boardsMutate: vi.fn(),
  activeBoardMutate: vi.fn(),
}))

vi.mock('@/lib/axios', () => ({ api: { delete: deleteMock } }))

vi.mock('react-hot-toast', () => {
  const toast = { success: toastSuccess, error: toastError }
  return { __esModule: true, default: toast, toast }
})

// The real context throws without a provider and pulls in SWR/useAuthUser, so
// we stub it with a controllable active board and spyable mutators.
vi.mock('@/contexts/BoardsContext', () => ({
  useBoardsContext: () => ({
    activeBoard: { id: 'board-1', name: 'Marketing', columns: [] },
    boardsMutate,
    activeBoardMutate,
    isValidatingBoards: false,
    isValidatingActiveBoard: false,
  }),
}))

// BaseModal renders through Radix's Dialog.Portal, which needs a Dialog.Root
// ancestor; `open` forces the portal content to mount.
const renderModal = (ui: ReactElement) =>
  render(
    <ThemeProvider theme={darkTheme}>
      <Dialog.Root open>{ui}</Dialog.Root>
    </ThemeProvider>,
  )

describe('DeleteModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('board', () => {
    it('renders the board name and the board consequence', async () => {
      renderModal(<DeleteModal type="board" onClose={vi.fn()} />)

      expect(
        await screen.findByRole('button', { name: 'Delete board' }),
      ).toBeInTheDocument()
      expect(screen.getByText('Marketing')).toBeInTheDocument()
      expect(
        screen.getByText(
          /This board and all of its columns and tasks will be permanently deleted/,
        ),
      ).toBeInTheDocument()
    })

    it('deletes the board, notifies, revalidates and closes', async () => {
      deleteMock.mockResolvedValueOnce({ data: { message: 'Board deleted' } })
      const onClose = vi.fn()
      const user = userEvent.setup()
      renderModal(<DeleteModal type="board" onClose={onClose} />)

      await user.click(
        await screen.findByRole('button', { name: 'Delete board' }),
      )

      await waitFor(() => {
        expect(deleteMock).toHaveBeenCalledWith('/boards/board-1')
      })
      expect(toastSuccess).toHaveBeenCalledWith('Board deleted')
      expect(boardsMutate).toHaveBeenCalled()
      expect(activeBoardMutate).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })

    it('closes without deleting when Cancel is clicked', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()
      renderModal(<DeleteModal type="board" onClose={onClose} />)

      await user.click(await screen.findByRole('button', { name: 'Cancel' }))

      expect(onClose).toHaveBeenCalled()
      expect(deleteMock).not.toHaveBeenCalled()
    })

    it('still closes when the delete request fails', async () => {
      deleteMock.mockRejectedValueOnce(new Error('boom'))
      const onClose = vi.fn()
      const user = userEvent.setup()
      renderModal(<DeleteModal type="board" onClose={onClose} />)

      await user.click(
        await screen.findByRole('button', { name: 'Delete board' }),
      )

      await waitFor(() => expect(onClose).toHaveBeenCalled())
      expect(toastSuccess).not.toHaveBeenCalled()
    })
  })

  describe('task', () => {
    const task: TaskProps = {
      id: 'task-9',
      name: 'Write docs',
      status: 'Todo',
      subtasks: [
        { id: 1, name: 'a', is_completed: false },
        { id: 2, name: 'b', is_completed: false },
      ],
    }

    it('renders the task name and a pluralised subtask consequence', async () => {
      renderModal(<DeleteModal type="task" task={task} onClose={vi.fn()} />)

      expect(
        await screen.findByRole('button', { name: 'Delete task' }),
      ).toBeInTheDocument()
      expect(screen.getByText('Write docs')).toBeInTheDocument()
      expect(
        screen.getByText(
          /This task and its 2 subtasks will be permanently deleted/,
        ),
      ).toBeInTheDocument()
    })

    it('deletes via the tasks route', async () => {
      deleteMock.mockResolvedValueOnce({ data: { message: 'Task deleted' } })
      const onClose = vi.fn()
      const user = userEvent.setup()
      renderModal(<DeleteModal type="task" task={task} onClose={onClose} />)

      await user.click(
        await screen.findByRole('button', { name: 'Delete task' }),
      )

      await waitFor(() =>
        expect(deleteMock).toHaveBeenCalledWith('/tasks/task-9'),
      )
      expect(toastSuccess).toHaveBeenCalledWith('Task deleted')
    })
  })
})
