/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

import {
  CloseButton,
  HeaderContent,
  ModalOverlay,
  ModalTitle,
} from '@/styles/shared'

import { Button } from '@/components/Shared/Button'
import {
  ActionsContainer,
  ButtonsContainer,
  Circle,
  DeleteTagContainer,
  EmptyWarning,
  ModalContent,
  TagContainer,
  TagName,
  TagsContainer,
  TagsTitle,
} from './styles'
import { tagColors } from '@/components/Shared/SelectInput'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'

import { TagProps } from '@/@types/tag'
import useRequest from '@/utils/useRequest'
import { PencilSimple, TrashSimple } from 'phosphor-react'
import { TagForm } from './Partials/TagForm'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'
import { handleApiError } from '@/utils/handleApiError'
import { useBoardsContext } from '@/contexts/BoardsContext'

interface Props {
  onClose: () => void
}

export function TagsModal({ onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const { mutate } = useBoardsContext()

  const [isTagFormOpen, setIsTagFormOpen] = useState(false)

  const [isDeleteTagWarningOpen, setIsDeleteTagWarningOpen] = useState(false)

  const [selectedTag, setSelectedTag] = useState<TagProps | null>(null)

  const { data: tags, mutate: tagsMutate } = useRequest<TagProps[]>({
    url: '/tags',
    method: 'GET',
  })

  const onDelete = async () => {
    try {
      setIsLoading(true)

      const response = await api.delete(`/tags/${selectedTag?.id}`)

      toast.success(response.data.message)
      setIsDeleteTagWarningOpen(false)

      mutate()
      tagsMutate()
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog.Portal>
      <ModalOverlay
        onClick={() => {
          onClose()
          setSelectedTag(null)
          setIsTagFormOpen(false)
          setIsDeleteTagWarningOpen(false)
        }}
      />
      <ModalContent>
        <HeaderContent>
          <ModalTitle>Edit Tags</ModalTitle>
          <CloseButton
            onClick={() => {
              onClose()
              setSelectedTag(null)
              setIsTagFormOpen(false)
              setIsDeleteTagWarningOpen(false)
            }}
          >
            <FontAwesomeIcon icon={faX} />
          </CloseButton>
        </HeaderContent>

        <VisuallyHidden>
          <Dialog.Description />
        </VisuallyHidden>

        {!isTagFormOpen && !isDeleteTagWarningOpen && (
          <TagsContainer>
            <TagsTitle>Tags</TagsTitle>
            {tags?.length ? (
              tags?.map((item, index) => {
                const tagColor = tagColors.find(
                  (tag) => tag.name === item.color,
                )?.color

                return (
                  <TagContainer key={index}>
                    <TagName>
                      <Circle color={tagColor as string} />
                      <p>{item.name}</p>
                    </TagName>
                    <ActionsContainer>
                      <PencilSimple
                        size={16}
                        onClick={() => {
                          setSelectedTag(item)
                          setIsTagFormOpen(true)
                          setIsDeleteTagWarningOpen(false)
                        }}
                      />
                      <TrashSimple
                        className="delete"
                        size={16}
                        onClick={() => {
                          setIsTagFormOpen(false)
                          setSelectedTag(item)
                          setIsDeleteTagWarningOpen(true)
                        }}
                      />
                    </ActionsContainer>
                  </TagContainer>
                )
              })
            ) : (
              <EmptyWarning>
                No tags available. How about creating your first one?
              </EmptyWarning>
            )}
          </TagsContainer>
        )}

        {isTagFormOpen && (
          <TagForm
            currentTags={tags}
            tagsMutate={tagsMutate}
            isSubmitting={isLoading}
            handleIsSubmitting={(value: boolean) => setIsLoading(value)}
            onClose={() => setIsTagFormOpen(false)}
            isEdit={selectedTag !== null}
            tag={selectedTag || undefined}
          />
        )}

        {!isTagFormOpen &&
          !isDeleteTagWarningOpen &&
          tags &&
          tags?.length < 8 && (
            <Button
              title={'Add New Tag'}
              type="button"
              variant="secondary"
              onClick={() => {
                setSelectedTag(null)
                setIsTagFormOpen(true)
                setIsDeleteTagWarningOpen(false)
              }}
            />
          )}

        {isDeleteTagWarningOpen && (
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
                onClick={() => {
                  setIsDeleteTagWarningOpen(false)
                }}
              />
            </ButtonsContainer>
          </DeleteTagContainer>
        )}
      </ModalContent>

      {isLoading && <LoadingComponent />}
    </Dialog.Portal>
  )
}
