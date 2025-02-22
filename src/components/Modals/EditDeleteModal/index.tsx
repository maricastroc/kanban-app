import * as Dialog from '@radix-ui/react-dialog'
import { ModalContent, ActionBtn } from './styles'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { DeleteModal } from '../DeleteModal'
import { BoardFormModal } from '../BoardFormModal'

interface EditDeleteModalProps {
  onClose: () => void
}

export function EditDeleteModal({ onClose }: EditDeleteModalProps) {
  const { activeBoard, enableDarkMode } = useBoardsContext()

  const [isEditModalOpen, setEditModalOpen] = useState(false)

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)

  const handleEditModalOpen = () => {
    setEditModalOpen(true)
  }

  const handleDeleteModalOpen = () => {
    setDeleteModalOpen(true)
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    onClose()
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    onClose()
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay onClick={onClose} />
      <VisuallyHidden>
        <Dialog.Title>Edit or Delete Board</Dialog.Title>
        <Dialog.Description>Select an option to proceed.</Dialog.Description>
      </VisuallyHidden>
      <ModalContent className={`${enableDarkMode ? 'dark' : 'light'}`}>
        <Dialog.Root open={isEditModalOpen}>
          <Dialog.Trigger asChild>
            <ActionBtn onClick={handleEditModalOpen} className="edit">
              Edit Board
            </ActionBtn>
          </Dialog.Trigger>
          {activeBoard && (
            <BoardFormModal
              isEditing
              onClose={closeEditModal}
              board={activeBoard}
            />
          )}
        </Dialog.Root>
        <Dialog.Root open={isDeleteModalOpen}>
          <Dialog.Trigger asChild>
            <ActionBtn onClick={handleDeleteModalOpen} className="delete">
              Delete Board
            </ActionBtn>
          </Dialog.Trigger>
          {activeBoard && (
            <DeleteModal
              type={'board'}
              onClose={closeDeleteModal}
              board={activeBoard}
            />
          )}
        </Dialog.Root>
      </ModalContent>
    </Dialog.Portal>
  )
}
