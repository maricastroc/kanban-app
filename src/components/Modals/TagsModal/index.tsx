import { Button } from '@/components/Core/Button'
import {
  ActionButton,
  ActionsContainer,
  Circle,
  EmptyWarning,
  TagContainer,
  TagName,
  TagsContainer,
  TagsTitle,
} from './styles'
import { tagColors } from '@/components/Core/SelectInput'

import { TagProps } from '@/@types/tag'
import { PencilSimple, TrashSimple } from 'phosphor-react'
import { BaseModal } from '../BaseModal'

interface Props {
  onClose: () => void
  onSelectTag: (tag: TagProps) => void
  onAddTag: () => void
  onDeleteTag: (tag: TagProps) => void
  tags: TagProps[] | null
}

export function TagsModal({
  onClose,
  tags,
  onAddTag,
  onSelectTag,
  onDeleteTag,
}: Props) {
  return (
    <BaseModal
      title="Edit Tags"
      padding="1.5rem 1.5rem 2rem"
      height="auto"
      onClose={onClose}
    >
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
                  <ActionButton
                    onClick={() => {
                      onSelectTag(item)
                    }}
                  >
                    <PencilSimple size={20} />
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      onDeleteTag(item)
                    }}
                  >
                    <TrashSimple className="delete" size={20} />
                  </ActionButton>
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

      <Button
        title={'Add New Tag'}
        type="button"
        variant="secondary"
        onClick={onAddTag}
      />
    </BaseModal>
  )
}
