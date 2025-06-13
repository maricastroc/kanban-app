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

  const { activeBoard, activeBoardMutate, handleChangeActiveBoard } =
    useBoardsContext()

  const handleDelete = async (uuid: number | string) => {
    if (!activeBoard) return

    const previousBoard = structuredClone(activeBoard)

    if (type === 'task' && task) {
      const optimisticBoard = {
        ...activeBoard,
        columns: activeBoard.columns.map((column) => {
          if (column.name !== task.status) return column

          return {
            ...column,
            tasks: column.tasks?.filter((t) => t.id !== task.id) || [],
          }
        }),
      }

      handleChangeActiveBoard(optimisticBoard)
    }

    try {
      setIsLoading(true)

      const routePath = type === 'board' ? `/boards/${uuid}` : `/tasks/${uuid}`

      await api.delete(routePath)

      await activeBoardMutate()
    } catch (error) {
      if (type === 'task') {
        handleChangeActiveBoard(previousBoard)
      }

      handleApiError(error)
      toast.error('Erro ao deletar')
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
