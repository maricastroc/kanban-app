import { BoardColumnProps } from '@/@types/board-column'
import * as Dialog from '@radix-ui/react-dialog'
import { AddColumnBtn, AddColumnContainer } from './styles'
import { useTheme } from '@/contexts/ThemeContext'
import { BoardColumn } from '../BoardColumn'
import { ColumnFormModal } from '@/components/Modals/ColumnFormModal'

interface Props {
  columns?: BoardColumnProps[]
  isLoading: boolean
  isApiProcessing: boolean
  dragDisabled: boolean
  onOpenModal: (value: boolean) => void
  isOpen: boolean
}

export const BoardColumnsList = ({
  columns,
  dragDisabled,
  isOpen,
  onOpenModal,
}: Props) => {
  const { enableDarkMode } = useTheme()

  return (
    columns && (
      <>
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            id={column.id}
            column={column}
            name={column.name}
            tasks={column.tasks}
            dragDisabled={dragDisabled}
          />
        ))}
        {columns.length < 6 && (
          <Dialog.Root open={isOpen} onOpenChange={onOpenModal}>
            <Dialog.Trigger asChild>
              <AddColumnContainer className={enableDarkMode ? 'dark' : 'light'}>
                <AddColumnBtn>
                  <span>+</span> New column
                </AddColumnBtn>
              </AddColumnContainer>
            </Dialog.Trigger>
            <ColumnFormModal onClose={() => onOpenModal(false)} />
          </Dialog.Root>
        )}
      </>
    )
  )
}
