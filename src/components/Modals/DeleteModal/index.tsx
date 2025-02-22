/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Dialog from '@radix-ui/react-dialog'
import { ButtonsContainer, ModalDescription } from './styles'
import { Button } from '@/components/Shared/Button'
import { BoardProps } from '@/@types/board'
import {
  Loader,
  ModalContent,
  ModalLoading,
  ModalOverlay,
  ModalTitle,
} from '@/styles/shared'
import { TaskProps } from '@/@types/task'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'
import { KeyedMutator } from 'swr'
import { AxiosResponse } from 'axios'
import { Circles } from 'react-loader-spinner'

interface DeleteBoardProps {
  type: 'board' | 'task'
  board?: BoardProps | undefined
  task?: TaskProps | undefined
  mutate: KeyedMutator<AxiosResponse<BoardProps, any>>
  onClose: () => void
}

export function DeleteModal({
  type,
  board,
  task,
  onClose,
  mutate,
}: DeleteBoardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true)

      const routePath = type === 'board' ? '/board/delete' : '/tasks/delete'

      const payload = {
        id,
      }

      const response = await api.delete(routePath, { data: payload })

      mutate()
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
              type === 'board' ? `${board?.name} board` : `${task?.title} task`
            }’? This action will remove all columns and tasks and cannot be reversed.`}
          </span>
        </ModalDescription>

        <ButtonsContainer>
          <Button
            title="Delete"
            variant="tertiary"
            onClick={() => {
              if (board && type === 'board') {
                handleDelete(board.id)
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

        {isLoading && (
          <ModalLoading>
            <Loader>
              <Circles color="#635FC7" height={80} width={80} />
            </Loader>
          </ModalLoading>
        )}
      </ModalContent>
    </Dialog.Portal>
  )
}
