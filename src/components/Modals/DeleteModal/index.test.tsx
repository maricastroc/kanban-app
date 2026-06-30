import type { ReactElement } from 'react'
import type { TaskProps } from '@/@types/task'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import * as Dialog from '@radix-ui/react-dialog'
import { darkTheme } from '@/styles/themes/dark'
import { DeleteModal } from './index'

const { deleteWithUndo } = vi.hoisted(() => ({
  deleteWithUndo: vi.fn(),
}))

// The deferred-delete orchestration lives in the hook; here we only assert the
// modal hands the right request over and closes.
vi.mock('@/hooks/useUndoableDelete', () => ({
  useUndoableDelete: () => ({ deleteWithUndo }),
}))

// The real context throws without a provider and pulls in SWR/useAuthUser, so
// we stub it with a controllable active board.
vi.mock('@/contexts/BoardsContext', () => ({
  useBoardsContext: () => ({
    activeBoard: { id: 'board-1', name: 'Marketing', columns: [] },
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
          /This board and all of its columns and tasks will be deleted/,
        ),
      ).toBeInTheDocument()
    })

    it('requests an undoable board delete and closes', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()
      renderModal(<DeleteModal type="board" onClose={onClose} />)

      await user.click(
        await screen.findByRole('button', { name: 'Delete board' }),
      )

      expect(deleteWithUndo).toHaveBeenCalledWith({ type: 'board' })
      expect(onClose).toHaveBeenCalled()
    })

    it('closes without deleting when Cancel is clicked', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()
      renderModal(<DeleteModal type="board" onClose={onClose} />)

      await user.click(await screen.findByRole('button', { name: 'Cancel' }))

      expect(onClose).toHaveBeenCalled()
      expect(deleteWithUndo).not.toHaveBeenCalled()
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
        screen.getByText(/This task and its 2 subtasks will be deleted/),
      ).toBeInTheDocument()
    })

    it('requests an undoable task delete with the task and closes', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()
      renderModal(<DeleteModal type="task" task={task} onClose={onClose} />)

      await user.click(
        await screen.findByRole('button', { name: 'Delete task' }),
      )

      expect(deleteWithUndo).toHaveBeenCalledWith({ type: 'task', task })
      expect(onClose).toHaveBeenCalled()
    })
  })
})
