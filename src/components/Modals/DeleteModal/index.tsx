import * as Dialog from '@radix-ui/react-dialog'
import { ButtonsContainer, ModalDescription } from './styles'
import { Button } from '@/components/Shared/Button'
import { ModalContent, ModalOverlay, ModalTitle } from '@/styles/shared'
import { TaskProps } from '@/@types/task'
import { useState } from 'react'
import toast from 'react-hot-toast'
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

  const { activeBoard, mutate, boardsMutate } = useBoardsContext()

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true)

      const routePath = type === 'board' ? '/board/delete' : '/tasks/delete'

      const payload = {
        id,
      }

      const response = await api.delete(routePath, { data: payload })

      mutate()
      boardsMutate()

      toast?.success(response.data.message)
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
                : `${task?.title} task`
            }’? This action will remove all columns and tasks and cannot be reversed.`}
          </span>
        </ModalDescription>

        <ButtonsContainer>
          <Button
            title="Delete"
            variant="tertiary"
            onClick={() => {
              if (activeBoard && type === 'board') {
                handleDelete(activeBoard.id)
              } else if (task) {
                handleDelete(task.id)
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
