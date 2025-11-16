import * as Dialog from '@radix-ui/react-dialog'
import { ModalContent, ActionBtn, LogoutBtn } from './styles'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useState } from 'react'
import { DeleteModal } from '../DeleteModal'
import { BoardFormModal } from '../BoardFormModal'
import { useTheme } from '@/contexts/ThemeContext'
import { SignOut } from 'phosphor-react'
import toast from 'react-hot-toast'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { signOut } from 'next-auth/react'

interface Props {
  onClose: () => void
}

export function ActionsModal({ onClose }: Props) {
  const { enableDarkMode } = useTheme()

  const { activeBoard, isLoading } = useBoardsContext()

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
    try {
      await api.get('/logout')

      await signOut({
        redirect: false,
        callbackUrl: '/login',
      })

      localStorage.removeItem('auth_token')
      localStorage.removeItem('activeBoard')
      localStorage.removeItem('boards')

      const domain = window.location.hostname
      const cookiesToRemove = [
        'next-auth.csrf-token',
        'next-auth.session-token',
        'next-auth.callback-url',
        '__Secure-next-auth.session-token',
        '__Host-next-auth.csrf-token',
      ]

      cookiesToRemove.forEach((cookie) => {
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`
      })

      sessionStorage.clear()

      toast.success('See you soon!')

      window.location.replace('/login')
    } catch (error) {
      handleApiError(error)
    }
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
                <ActionBtn
                  disabled={isLoading}
                  onClick={handleEditModalOpen}
                  className="edit"
                >
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
