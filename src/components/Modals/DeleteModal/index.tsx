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
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useUndoableDelete } from '@/hooks/useUndoableDelete'
import { BaseModal } from '../BaseModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

interface DeleteBoardProps {
  type: 'board' | 'task'
  task?: TaskProps | undefined
  onClose: () => void
}

export function DeleteModal({ type, task, onClose }: DeleteBoardProps) {
  const { activeBoard, isValidatingBoards, isValidatingActiveBoard } =
    useBoardsContext()
  const { deleteWithUndo } = useUndoableDelete()

  const isLoading = isValidatingBoards || isValidatingActiveBoard

  const isBoard = type === 'board'
  const targetName = isBoard ? activeBoard?.name : task?.name

  const subtaskCount = task?.subtasks?.length ?? 0

  let consequence: string
  if (isBoard) {
    consequence = 'This board and all of its columns and tasks will be deleted.'
  } else if (subtaskCount > 0) {
    consequence = `This task and its ${subtaskCount} ${
      subtaskCount === 1 ? 'subtask' : 'subtasks'
    } will be deleted.`
  } else {
    consequence = 'This task will be deleted.'
  }

  const handleDelete = () => {
    if (isBoard) {
      if (!activeBoard) return
      deleteWithUndo({ type: 'board' })
    } else if (task) {
      deleteWithUndo({ type: 'task', task })
    }
    onClose()
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
        {consequence} You can undo this for a few seconds.
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
          onClick={handleDelete}
        />
      </ButtonsContainer>
    </BaseModal>
  )
}
