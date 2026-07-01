import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useEscapeKey } from '@/utils/useEscapeKey'
import { BoardFormModal } from '../BoardFormModal'
import { BaseModal } from '../BaseModal'
import { BoardList } from '@/components/Core/BoardList'
import { ThemeToggle } from '@/components/Core/ThemeToggle'
import { CreateBoardButton } from '@/components/Core/BoardList/styles'
import { CreateArea, SheetFooter } from './styles'

interface BoardsDetailsModalProps {
  onClose: () => void
}

export function BoardsDetailsModal({ onClose }: BoardsDetailsModalProps) {
  const { boards } = useBoardsContext()

  const [addBoardModalOpen, setAddBoardModalOpen] = useState(false)

  useEscapeKey(onClose)

  return (
    <BaseModal
      onClose={onClose}
      titlePadding="0 1.5rem"
      padding="1.5rem 0"
      title={`All Boards (${boards?.length || 0})`}
    >
      <BoardList onNavigate={onClose} />

      <CreateArea>
        <Dialog.Root open={addBoardModalOpen}>
          <Dialog.Trigger asChild onClick={() => setAddBoardModalOpen(true)}>
            <CreateBoardButton className="create">
              <span className="plus-box">
                <FontAwesomeIcon icon={faPlus} />
              </span>
              <p>Create board</p>
            </CreateBoardButton>
          </Dialog.Trigger>
          <BoardFormModal
            isEditing={false}
            onClose={() => setAddBoardModalOpen(false)}
          />
        </Dialog.Root>
      </CreateArea>

      <SheetFooter>
        <ThemeToggle />
      </SheetFooter>
    </BaseModal>
  )
}
