import * as Dialog from '@radix-ui/react-dialog'

import { ModalContent, ActionBtn } from './styles'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { EditBoardModal } from '../EditBoardModal'
import { DeleteBoard } from '../DeleteBoardModal'

interface MoreOptionsModal {
  onClose: () => void
}

export function MoreOptionsModal({ onClose }: MoreOptionsModal) {
  const { activeBoard } = useBoardsContext()

  const [openEditBoardModal, setOpenEditBoardModal] = useState(false)

  const [openDeleteBoardModal, setOpenDeleteBoardModal] = useState(false)

  return (
    <Dialog.Portal>
      <Dialog.Overlay onClick={() => onClose()} />
      <VisuallyHidden>
        <Dialog.Title />
      </VisuallyHidden>
      <VisuallyHidden>
        <Dialog.Description />
      </VisuallyHidden>
      <ModalContent className="DialogContent" aria-describedby={undefined}>
        <Dialog.Root open={openEditBoardModal}>
          <Dialog.Trigger asChild>
            <ActionBtn
              onClick={() => setOpenEditBoardModal(true)}
              className="edit"
            >
              Edit Board
            </ActionBtn>
          </Dialog.Trigger>
          {activeBoard && (
            <EditBoardModal
              onClose={() => {
                setOpenEditBoardModal(false)
                onClose()
              }}
              board={activeBoard}
            />
          )}
        </Dialog.Root>
        <Dialog.Root open={openDeleteBoardModal}>
          <Dialog.Trigger asChild>
            <ActionBtn
              onClick={() => setOpenDeleteBoardModal(true)}
              className="delete"
            >
              Delete Board
            </ActionBtn>
          </Dialog.Trigger>
          {activeBoard && (
            <DeleteBoard
              onClose={() => {
                setOpenDeleteBoardModal(false)
                onClose()
              }}
              board={activeBoard}
            />
          )}
        </Dialog.Root>
      </ModalContent>
    </Dialog.Portal>
  )
}
