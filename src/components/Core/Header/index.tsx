import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  AddTaskBtn,
  BoardName,
  BoardNameContainer,
  Container,
  LogoContainer,
  OptionsContainer,
  MoreOptionsWrapper,
  MoreOptionsBtn,
} from './styles'
import Logo from '@/../public/icon.svg'
import {
  faAngleDown,
  faEllipsisVertical,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import * as Dialog from '@radix-ui/react-dialog'
import { ViewBoardsModal } from '@/components/Modals/ViewBoardsModal'
import { useEffect, useState } from 'react'
import { AddTaskModal } from '@/components/Modals/AddTaskModal'
import { MoreOptionsModal } from '@/components/Modals/MoreOptionsModal'
import { BREAKPOINT_SM } from '@/utils/constants'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useWindowResize } from '@/utils/useWindowResize'

interface HeaderProps {
  onChangeTheme: () => void
}

export function Header({ onChangeTheme }: HeaderProps) {
  const { activeBoard } = useBoardsContext()

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)

  const [isViewBoardsModalOpen, setIsViewBoardsModalOpen] = useState(false)

  const [isMoreOptionsModalOpen, setIsMoreOptionsModalOpen] = useState(false)

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM)

  useEffect(() => {
    if (!isSmallerThanSm) {
      setIsViewBoardsModalOpen(false)
    }
  }, [isSmallerThanSm])

  return (
    <Container>
      <LogoContainer>
        {isSmallerThanSm && (
          <img src={Logo} width={24} height={24} alt="Project Logo" />
        )}

        <Dialog.Root open={isViewBoardsModalOpen}>
          <Dialog.Trigger asChild>
            <BoardNameContainer
              onClick={() => isSmallerThanSm && setIsViewBoardsModalOpen(true)}
            >
              <BoardName>{activeBoard?.name}</BoardName>
              {isSmallerThanSm && <FontAwesomeIcon icon={faAngleDown} />}
            </BoardNameContainer>
          </Dialog.Trigger>
          <ViewBoardsModal
            onChangeTheme={onChangeTheme}
            onClose={() => setIsViewBoardsModalOpen(false)}
          />
        </Dialog.Root>
      </LogoContainer>
      <OptionsContainer>
        <Dialog.Root open={isAddTaskModalOpen}>
          <Dialog.Trigger asChild>
            <AddTaskBtn onClick={() => setIsAddTaskModalOpen(true)}>
              <FontAwesomeIcon icon={faPlus} />
              <p>+ Add New Task</p>
            </AddTaskBtn>
          </Dialog.Trigger>
          <AddTaskModal onClose={() => setIsAddTaskModalOpen(false)} />
        </Dialog.Root>

        <MoreOptionsWrapper>
          <Dialog.Root
            open={isMoreOptionsModalOpen}
            onOpenChange={setIsMoreOptionsModalOpen}
          >
            <Dialog.Trigger asChild>
              <MoreOptionsBtn>
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  onClick={() => setIsMoreOptionsModalOpen(false)}
                />
              </MoreOptionsBtn>
            </Dialog.Trigger>
            <MoreOptionsModal onClose={() => setIsMoreOptionsModalOpen(false)} />
          </Dialog.Root>
        </MoreOptionsWrapper>
      </OptionsContainer>
    </Container>
  )
}
