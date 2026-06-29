import {
  ButtonsContainer,
  Header,
  IconBadge,
  ModalDescription,
  TargetCard,
  Title,
} from './styles'
import { Button } from '@/components/Core/Button'
import { TaskProps } from '@/@types/task'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'
import { useBoardsContext } from '@/contexts/BoardsContext'
import toast from 'react-hot-toast'
import { BaseModal } from '../BaseModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

interface DeleteBoardProps {
  type: 'board' | 'task'
  task?: TaskProps | undefined
  onClose: () => void
}

export function DeleteModal({ type, task, onClose }: DeleteBoardProps) {
  const {
    activeBoard,
    activeBoardMutate,
    boardsMutate,
    isValidatingBoards,
    isValidatingActiveBoard,
  } = useBoardsContext()

  const isLoading = isValidatingBoards || isValidatingActiveBoard

  const isBoard = type === 'board'
  const targetName = isBoard ? activeBoard?.name : task?.name

  const subtaskCount = task?.subtasks?.length ?? 0

  let consequence: string
  if (isBoard) {
    consequence =
      'This board and all of its columns and tasks will be permanently deleted.'
  } else if (subtaskCount > 0) {
    consequence = `This task and its ${subtaskCount} ${
      subtaskCount === 1 ? 'subtask' : 'subtasks'
    } will be permanently deleted.`
  } else {
    consequence = 'This task will be permanently deleted.'
  }

  const handleDelete = async (id: number | string) => {
    if (!activeBoard) return

    try {
      const routePath = isBoard ? `/boards/${id}` : `/tasks/${id}`

      const response = await api.delete(routePath)

      if (response?.data) {
        toast.success(response.data.message)
      }

      await boardsMutate()
      await activeBoardMutate()
    } catch (error) {
      handleApiError(error)
    } finally {
      onClose()
    }
  }

  return (
    <BaseModal
      onClose={onClose}
      isLoading={isLoading}
      hasHeader={false}
      className="delete"
    >
      <Header>
        <IconBadge>
          <FontAwesomeIcon icon={faTrashCan} />
        </IconBadge>
        <Title>{isBoard ? 'Delete board' : 'Delete task'}</Title>
      </Header>

      {targetName && (
        <TargetCard>
          <span>{targetName}</span>
        </TargetCard>
      )}

      <ModalDescription>
        {consequence} This action cannot be undone.
      </ModalDescription>

      <ButtonsContainer>
        <Button
          title="Cancel"
          variant="secondary"
          size="sm"
          fullWidth={false}
          disabled={isLoading}
          onClick={onClose}
        />
        <Button
          title={isBoard ? 'Delete board' : 'Delete task'}
          variant="tertiary"
          size="sm"
          fullWidth={false}
          disabled={isLoading}
          onClick={() => {
            if (activeBoard && isBoard) {
              handleDelete(activeBoard.id as string)
            } else if (task) {
              handleDelete(task.id as string)
            }
          }}
        />
      </ButtonsContainer>
    </BaseModal>
  )
}
