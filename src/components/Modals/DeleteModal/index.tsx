import * as Dialog from '@radix-ui/react-dialog'
import { ButtonsContainer, ModalDescription } from './styles'
import { Button } from '@/components/Shared/Button'
import { ModalContent, ModalOverlay, ModalTitle } from '@/styles/shared'
import { TaskProps } from '@/@types/task'
import { useState } from 'react'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'
import { useBoardsContext } from '@/contexts/BoardsContext'

interface DeleteBoardProps {
  type: 'board' | 'task'
  task?: TaskProps | undefined
  onClose: () => void
}

export function DeleteModal({ type, task, onClose }: DeleteBoardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { activeBoard, activeBoardMutate } = useBoardsContext()

  const handleDelete = async (uuid: number | string) => {
    if (!activeBoard) return

    try {
      setIsLoading(true)

      const routePath = type === 'board' ? `/boards/${uuid}` : `/tasks/${uuid}`

      await api.delete(routePath)

      await activeBoardMutate()
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)

      setTimeout(() => {
        onClose()
      }, 500)
    }
  }

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
            onClick={() => {
              if (activeBoard && type === 'board') {
                handleDelete(activeBoard.uuid as string)
              } else if (task) {
                handleDelete(task.uuid as string)
              }
            }}
          />
          <Button
            title="Cancel"
            variant="secondary"
            onClick={() => onClose()}
          />
        </ButtonsContainer>

        {isLoading && <LoadingComponent />}
      </ModalContent>
    </Dialog.Portal>
  )
}
