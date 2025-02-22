import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  AddTaskBtn,
  BoardName,
  BoardNameContainer,
  Container,
  LogoContainer,
  EditDeleteContainer,
  EditDeleteWrapper,
  EditDeleteBtn,
} from './styles'
import Logo from '@/../public/icon.svg'
import {
  faAngleDown,
  faEllipsisVertical,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import * as Dialog from '@radix-ui/react-dialog'
import { BoardsDetailsModal } from '@/components/Modals/BoardsDetailsModal'
import { useEffect, useState } from 'react'
import { TaskFormModal } from '@/components/Modals/TaskFormModal'
import { EditDeleteModal } from '@/components/Modals/EditDeleteModal'
import { BREAKPOINT_SM } from '@/utils/constants'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useWindowResize } from '@/utils/useWindowResize'
import useRequest from '@/utils/useRequest'
import { BoardProps } from '@/@types/board'

interface HeaderProps {
  onChangeTheme: () => void
  mutate: any
}

export function Header({ onChangeTheme, mutate }: HeaderProps) {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)

  const [isBoardsDetailsModalOpen, setIsBoardsDetailsModalOpen] =
    useState(false)

  const [isEditDeleteModalOpen, setIsEditDeleteModalOpen] = useState(false)

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM)

  const { data: activeBoard } =
  useRequest<BoardProps>({
    url: '/board',
    method: 'GET',
})

  useEffect(() => {
    if (!isSmallerThanSm) {
      setIsBoardsDetailsModalOpen(false)
    }
  }, [isSmallerThanSm])

  return (
    <Container>
      <LogoContainer>
        {isSmallerThanSm && (
          <img src={Logo} width={24} height={24} alt="Project Logo" />
        )}

        <Dialog.Root open={isBoardsDetailsModalOpen}>
          <Dialog.Trigger asChild>
            <BoardNameContainer
              onClick={() =>
                isSmallerThanSm && setIsBoardsDetailsModalOpen(true)
              }
            >
              <BoardName>{activeBoard?.name}</BoardName>
              {isSmallerThanSm && <FontAwesomeIcon icon={faAngleDown} />}
            </BoardNameContainer>
          </Dialog.Trigger>
          <BoardsDetailsModal
            onChangeTheme={onChangeTheme}
            onClose={() => setIsBoardsDetailsModalOpen(false)}
          />
        </Dialog.Root>
      </LogoContainer>
      <EditDeleteContainer>
        <Dialog.Root open={isAddTaskModalOpen}>
          <Dialog.Trigger asChild>
            <AddTaskBtn onClick={() => setIsAddTaskModalOpen(true)}>
              <FontAwesomeIcon icon={faPlus} />
              <p>+ Add New Task</p>
            </AddTaskBtn>
          </Dialog.Trigger>
          <TaskFormModal
            isEditing={false}
            boardId={activeBoard?.id || ''}
            mutate={mutate}
            onClose={() => setIsAddTaskModalOpen(false)}
          />
        </Dialog.Root>

        <EditDeleteWrapper>
          <Dialog.Root
            open={isEditDeleteModalOpen}
            onOpenChange={setIsEditDeleteModalOpen}
          >
            <Dialog.Trigger asChild>
              <EditDeleteBtn>
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  onClick={() => setIsEditDeleteModalOpen(false)}
                />
              </EditDeleteBtn>
            </Dialog.Trigger>
            <EditDeleteModal onClose={() => setIsEditDeleteModalOpen(false)} />
          </Dialog.Root>
        </EditDeleteWrapper>
      </EditDeleteContainer>
    </Container>
  )
}
