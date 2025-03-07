import * as Dialog from '@radix-ui/react-dialog'
import { ModalContent, ActionBtn, LogoutBtn } from './styles'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useState } from 'react'
import { DeleteModal } from '../DeleteModal'
import { BoardFormModal } from '../BoardFormModal'
import { useTheme } from '@/contexts/ThemeContext'
import { SignOut } from 'phosphor-react'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useBoardsContext } from '@/contexts/BoardsContext'

interface EditDeleteModalProps {
  onClose: () => void
}

export function EditDeleteModal({ onClose }: EditDeleteModalProps) {
  const { enableDarkMode } = useTheme()

  const { activeBoard } = useBoardsContext()

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

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
    toast?.success('See you soon!')
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay onClick={onClose} />
      <VisuallyHidden>
        <Dialog.Title>Edit or Delete Board</Dialog.Title>
        <Dialog.Description>Select an option to proceed.</Dialog.Description>
      </VisuallyHidden>
      <ModalContent className={`${enableDarkMode ? 'dark' : 'light'}`}>
        {activeBoard && (
          <>
            <Dialog.Root open={isEditModalOpen}>
              <Dialog.Trigger asChild>
                <ActionBtn onClick={handleEditModalOpen} className="edit">
                  Edit Board
                </ActionBtn>
              </Dialog.Trigger>
              {activeBoard && (
                <BoardFormModal isEditing onClose={closeEditModal} />
              )}
            </Dialog.Root>
            <Dialog.Root open={isDeleteModalOpen}>
              <Dialog.Trigger asChild>
                <ActionBtn onClick={handleDeleteModalOpen} className="delete">
                  Delete Board
                </ActionBtn>
              </Dialog.Trigger>
              {activeBoard && (
                <DeleteModal type={'board'} onClose={closeDeleteModal} />
              )}
            </Dialog.Root>
          </>
        )}
        <LogoutBtn onClick={handleLogout}>
          Logout
          <SignOut size={22} />
        </LogoutBtn>
      </ModalContent>
    </Dialog.Portal>
  )
}
