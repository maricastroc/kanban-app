import * as Dialog from '@radix-ui/react-dialog'
import { ButtonsContainer, ModalDescription } from './styles'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { Button } from '@/components/Shared/Button'
import { BoardProps } from '@/@types/board'
import { ModalContent, ModalOverlay, ModalTitle } from '@/styles/shared'
import { useTaskContext } from '@/contexts/TasksContext'
import { TaskProps } from '@/@types/task'

interface DeleteBoardProps {
  type: 'board' | 'task'
  board?: BoardProps | undefined
  task?: TaskProps | undefined
  onClose: () => void
}

export function DeleteModal({ type, board, task, onClose }: DeleteBoardProps) {
  const { deleteBoard } = useBoardsContext()

  const { deleteTask } = useTaskContext()

  return (
    <Dialog.Portal>
      <ModalOverlay className="DialogOverlay" onClick={() => onClose()} />
      <ModalContent className="delete">
        <ModalTitle className="delete">{`Delete this ${
          type === 'board' ? 'board' : 'task'
        }?`}</ModalTitle>
        <ModalDescription>
          <span>
            {`Are you sure you want to delete the ‘${
              type === 'board' ? `${board?.name} board` : `${task?.title} task`
            }’? This action will remove all columns and tasks and cannot be reversed.`}
          </span>
        </ModalDescription>

        <ButtonsContainer>
          <Button
            title="Delete"
            variant="tertiary"
            onClick={() => {
              if (type === 'board') {
                deleteBoard(board)
              } else deleteTask(task)
              onClose()
            }}
          />
          <Button
            title="Cancel"
            variant="secondary"
            onClick={() => onClose()}
          />
        </ButtonsContainer>
      </ModalContent>
    </Dialog.Portal>
  )
}
