/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { TagProps } from '@/@types/tag'
import { BaseModal } from '../BaseModal'
import { ButtonsContainer, DeleteTagContainer } from './styles'
import { Button } from '@/components/Core/Button'
import toast from 'react-hot-toast'
import { api } from '@/lib/axios'
import { KeyedMutator } from 'swr'
import { AxiosResponse } from 'axios'
import { useAppDispatch } from '@/store/hooks'
import { fetchActiveBoard } from '@/store/boardsSlice'
import { handleApiError } from '@/utils/handleApiError'

interface Props {
  onClose: () => void
  tagsMutate: KeyedMutator<
    AxiosResponse<
      {
        tags: TagProps[]
      },
      any
    >
  >
  selectedTag: TagProps | null
}

export function DeleteTagModal({ onClose, tagsMutate, selectedTag }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useAppDispatch()

  const onDelete = async () => {
    try {
      setIsLoading(true)

      const response = await api.delete(`/tags/${selectedTag?.id}`)

      toast.success(response.data.message)
      onClose()

      dispatch(fetchActiveBoard())
      await tagsMutate()
      onClose()
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BaseModal
      isLoading={isLoading}
      title="Delete Tag"
      padding="1.5rem 1.5rem 2rem"
      height="auto"
      onClose={onClose}
    >
      <DeleteTagContainer>
        <h2>Warning!</h2>
        <p>{`${selectedTag?.name} may be linked to a task. Deleting it will remove the tag from any associated tasks. Are you sure you want to proceed?`}</p>
        <ButtonsContainer>
          <Button
            title="Delete"
            variant="tertiary"
            disabled={isLoading}
            onClick={() => {
              onDelete()
            }}
          />
          <Button
            title="Cancel"
            variant="secondary"
            disabled={isLoading}
            onClick={onClose}
          />
        </ButtonsContainer>
      </DeleteTagContainer>
    </BaseModal>
  )
}
