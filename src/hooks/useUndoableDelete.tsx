import { toast } from 'react-hot-toast'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { TaskProps } from '@/@types/task'
import { UndoToast } from '@/components/Shared/UndoToast'

const UNDO_DELAY = 5000

type DeleteArgs = { type: 'task'; task: TaskProps } | { type: 'board' }

// Deferred (Gmail-style) delete: the item is removed from the UI immediately and
// a toast offers an Undo for a few seconds. Only when that window elapses do we
// actually call the API — so undoing is just cancelling a timer, no backend
// "restore" endpoint required. The timer and toast live outside React's render
// tree (global setTimeout + the always-mounted Toaster), so they survive the
// delete modal unmounting right after the action is triggered.
export function useUndoableDelete() {
  const {
    boards,
    activeBoard,
    setBoards,
    setActiveBoard,
    boardsMutate,
    activeBoardMutate,
  } = useBoardsContext()

  const showUndoToast = (message: string, onUndo: () => void) =>
    toast.custom(
      (t) => <UndoToast toastInstance={t} message={message} onUndo={onUndo} />,
      { duration: UNDO_DELAY },
    )

  const deleteTask = (task: TaskProps) => {
    if (!activeBoard) return
    const snapshot = activeBoard

    setActiveBoard({
      ...activeBoard,
      columns: (activeBoard.columns ?? []).map((column) => ({
        ...column,
        tasks: column.tasks.filter((t) => String(t.id) !== String(task.id)),
      })),
    })

    let undone = false
    const timer = setTimeout(async () => {
      if (undone) return
      try {
        await api.delete(`/tasks/${task.id}`)
        await activeBoardMutate()
      } catch (error) {
        setActiveBoard(snapshot)
        handleApiError(error)
      }
    }, UNDO_DELAY)

    showUndoToast(`"${task.name}" deleted`, () => {
      undone = true
      clearTimeout(timer)
      setActiveBoard(snapshot)
    })
  }

  const deleteBoard = () => {
    if (!activeBoard || !boards) return
    const boardsSnapshot = boards
    const activeSnapshot = activeBoard
    const deletedId = activeBoard.id

    // Drop it from the sidebar and clear the active selection — the boards
    // context's existing "active board was removed" path auto-activates the
    // next board, so the user lands somewhere real during the undo window.
    setBoards(boards.filter((b) => String(b.id) !== String(deletedId)))
    setActiveBoard(undefined)

    let undone = false
    const timer = setTimeout(async () => {
      if (undone) return
      try {
        await api.delete(`/boards/${deletedId}`)
        await boardsMutate()
        await activeBoardMutate()
      } catch (error) {
        setBoards(boardsSnapshot)
        handleApiError(error)
      }
    }, UNDO_DELAY)

    showUndoToast(`"${activeSnapshot.name}" deleted`, async () => {
      undone = true
      clearTimeout(timer)
      setBoards(boardsSnapshot)
      // Re-point the server's active board back to the restored one, otherwise
      // the boards context re-syncs to whatever it auto-activated meanwhile.
      try {
        await api.patch(`boards/${deletedId}/activate`)
        setActiveBoard(activeSnapshot)
        await activeBoardMutate()
      } catch (error) {
        setActiveBoard(activeSnapshot)
        handleApiError(error)
      }
    })
  }

  const deleteWithUndo = (args: DeleteArgs) => {
    if (args.type === 'task') deleteTask(args.task)
    else deleteBoard()
  }

  return { deleteWithUndo }
}
