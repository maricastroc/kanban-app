/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Dialog from '@radix-ui/react-dialog'
import { ModalContent, ActionBtn, LogoutBtn } from './styles'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useState } from 'react'
import { DeleteModal } from '../DeleteModal'
import { BoardFormModal } from '../BoardFormModal'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleTheme } from '@/store/themeSlice'
import { setBoards, setActiveBoard } from '@/store/boardsSlice'
import { SignOut } from 'phosphor-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { useRouter } from 'next/router'

interface Props {
  onClose: () => void
}

export function ActionsModal({ onClose }: Props) {
  const dispatch = useAppDispatch()
  const enableDarkMode = useAppSelector((state) => state.theme.enableDarkMode)
  const activeBoard = useAppSelector((state) => state.boards.activeBoard)
  const isLoading = useAppSelector(
    (state) => state.boards.isValidatingBoards || state.boards.isValidatingActiveBoard,
  )

  const route = useRouter()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleEditModalOpen = () => {
    setIsEditModalOpen(true)
  }

  const handleDeleteModalOpen = () => {
    setIsDeleteModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    onClose()
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    onClose()
  }

  const finishLogout = () => {
    localStorage.removeItem('auth_token')

    delete api.defaults.headers.common.Authorization

    dispatch(setBoards(null))
    dispatch(setActiveBoard(undefined))

    route.push('/login')
  }

  const handleLogout = async () => {
    try {
      await api.get('/logout')
    } catch (error: any) {
      if (error.response?.status !== 401) {
        handleApiError(error)
      }
    } finally {
      toast.success('See you soon!')
      finishLogout()
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
            <Dialog.Root
              open={isEditModalOpen}
              onOpenChange={(open) => {
                setIsEditModalOpen(open)

                if (!open) {
                  onClose()
                }
              }}
            >
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
            <Dialog.Root
              open={isDeleteModalOpen}
              onOpenChange={(open) => {
                setIsDeleteModalOpen(open)

                if (!open) {
                  onClose()
                }
              }}
            >
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
        <span></span>
        <LogoutBtn onClick={handleLogout}>
          Logout
          <SignOut size={22} />
        </LogoutBtn>
      </ModalContent>
    </Dialog.Portal>
  )
}
