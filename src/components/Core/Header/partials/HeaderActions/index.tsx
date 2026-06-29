import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEllipsisVertical,
  faPlus,
  faTag,
} from '@fortawesome/free-solid-svg-icons'
import { Actions, ActionBtn, EditDeleteBtn } from '../../styles'
import { TagsModal } from '@/components/Modals/TagsModal'
import { DeleteTagModal } from '@/components/Modals/DeleteTagModal'
import { TaskFormModal } from '@/components/Modals/TaskFormModal'
import { ActionsModal } from '@/components/Modals/ActionsModal'
import { useTags } from '@/hooks/useTags'
import { useDisclosure } from '@/hooks/useDisclosure'
import { TagProps } from '@/@types/tag'
import { BoardProps } from '@/@types/board'

interface Props {
  activeBoard: BoardProps | undefined
}

export function HeaderActions({ activeBoard }: Props) {
  const { tags, mutate: tagsMutate } = useTags()

  const viewTags = useDisclosure()
  const deleteTag = useDisclosure()
  const addTask = useDisclosure()
  const actions = useDisclosure()

  const [selectedTag, setSelectedTag] = useState<TagProps | null>(null)

  const onCloseTagModal = () => {
    viewTags.close()
    deleteTag.close()
    setSelectedTag(null)
  }

  return (
    <Actions>
      <Dialog.Root open={viewTags.isOpen} onOpenChange={viewTags.setIsOpen}>
        <Dialog.Trigger asChild>
          <ActionBtn className="secondary">
            <FontAwesomeIcon icon={faTag} />
            <p>Tags</p>
          </ActionBtn>
        </Dialog.Trigger>
        <TagsModal
          tags={tags}
          tagsMutate={tagsMutate}
          onDeleteTag={(tag) => {
            setSelectedTag(tag)
            deleteTag.open()
            viewTags.close()
          }}
          onClose={onCloseTagModal}
        />
      </Dialog.Root>

      <Dialog.Root open={deleteTag.isOpen} onOpenChange={deleteTag.setIsOpen}>
        <DeleteTagModal
          tagsMutate={tagsMutate}
          selectedTag={selectedTag}
          onClose={onCloseTagModal}
        />
      </Dialog.Root>

      {activeBoard && (
        <Dialog.Root open={addTask.isOpen} onOpenChange={addTask.setIsOpen}>
          <Dialog.Trigger asChild>
            <ActionBtn>
              <FontAwesomeIcon icon={faPlus} />
              <p>New task</p>
            </ActionBtn>
          </Dialog.Trigger>
          <TaskFormModal
            isEditing={false}
            column={activeBoard?.columns?.[0]}
            onClose={addTask.close}
          />
        </Dialog.Root>
      )}

      <Dialog.Root open={actions.isOpen} onOpenChange={actions.setIsOpen}>
        <Dialog.Trigger asChild>
          <EditDeleteBtn>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </EditDeleteBtn>
        </Dialog.Trigger>
        <ActionsModal onClose={actions.close} />
      </Dialog.Root>
    </Actions>
  )
}
