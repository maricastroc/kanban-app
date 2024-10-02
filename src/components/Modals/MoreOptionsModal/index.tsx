import * as Dialog from '@radix-ui/react-dialog'

import {
  ModalContent,
  ActionBtn,
} from './styles'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { EditBoardModal } from '../EditBoardModal'

export function MoreOptionsModal() {
  const { activeBoard } = useBoardsContext()

  const [, setShowEditBoardModal] = useState(false)

  return (
    <Dialog.Portal>
      <VisuallyHidden>
        <Dialog.Title />
      </VisuallyHidden>
      <VisuallyHidden>
        <Dialog.Description />
      </VisuallyHidden>
      <ModalContent className="DialogContent" aria-describedby={undefined}>
      <Dialog.Root>
          <Dialog.Trigger asChild>
            <ActionBtn className='edit'>Edit Board</ActionBtn>
          </Dialog.Trigger>
          {setShowEditBoardModal && (
            <EditBoardModal onClose={() => setShowEditBoardModal(false)} board={activeBoard} />
          )}
        </Dialog.Root>
        <ActionBtn className='delete'>Delete Board</ActionBtn>
      </ModalContent>
    </Dialog.Portal>
  )
}
