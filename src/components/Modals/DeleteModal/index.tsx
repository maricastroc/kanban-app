import { ButtonsContainer, ModalDescription } from './styles'
import { Button } from '@/components/Core/Button'
import { TaskProps } from '@/@types/task'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'
import { useBoardsContext } from '@/contexts/BoardsContext'
import toast from 'react-hot-toast'
import { BaseModal } from '../BaseModal'

interface DeleteBoardProps {
  type: 'board' | 'task'
  task?: TaskProps | undefined
  onClose: () => void
}

export function DeleteModal({ type, task, onClose }: DeleteBoardProps) {
  const {
    isLoading,
    handleSetIsLoading,
    activeBoard,
    activeBoardMutate,
    boardsMutate,
  } = useBoardsContext()

  const handleDelete = async (id: number | string) => {
    if (!activeBoard) return

    try {
      handleSetIsLoading(true)

      const routePath = type === 'board' ? `/boards/${id}` : `/tasks/${id}`

      const response = await api.delete(routePath)

      if (response?.data) {
        toast.success(response.data.message)
      }

      await activeBoardMutate()
      await boardsMutate()

      if (type === 'board') {
        const storedBoard = localStorage.getItem('activeBoard')
        const parsedBoard = storedBoard ? JSON.parse(storedBoard) : null

        if (parsedBoard?.id === id) {
          localStorage.removeItem('activeBoard')
        }

        await activeBoardMutate()
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      handleSetIsLoading(false)

      setTimeout(() => {
        onClose()
      }, 500)
    }
  }

  return (
    <BaseModal
      onClose={onClose}
      isLoading={isLoading}
      title={`Delete this ${type === 'board' ? 'board' : 'task'}?`}
      maxHeight="13.5rem"
    >
      <ModalDescription>
        <span>
          {`Are you sure you want to delete the ‘${
            type === 'board'
              ? `${activeBoard?.name} board`
              : `${task?.name} task`
          }’? This action will remove all columns and tasks and cannot be reversed.`}
        </span>
      </ModalDescription>

      <ButtonsContainer>
        <Button
          title="Delete"
          variant="tertiary"
          disabled={isLoading}
          onClick={() => {
            if (activeBoard && type === 'board') {
              handleDelete(activeBoard.id as string)
            } else if (task) {
              handleDelete(task.id as string)
            }
          }}
        />
        <Button
          disabled={isLoading}
          title="Cancel"
          variant="secondary"
          onClick={() => onClose()}
        />
      </ButtonsContainer>
    </BaseModal>
  )
}
