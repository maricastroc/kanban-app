import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  AddTaskBtn,
  BoardName,
  BoardNameContainer,
  Container,
  LogoContainer,
  OptionsContainer,
  MoreOptionsWrapper,
  OpenMoreOptionsBtn,
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

interface HeaderProps {
  onChangeTheme: () => void
}

export function Header({ onChangeTheme }: HeaderProps) {
  const [openAddTaskModal, setOpenAddTaskModal] = useState(false)

  const [openViewBoardsModal, setOpenViewBoardsModal] = useState(false)

  const [openMoreOptionsModal, setOpenMoreOptionsModal] = useState(false)

  const [isSmallerThanSm, setIsSmallerThanSm] = useState(false)

  useEffect(() => {
    function handleResize() {
      setIsSmallerThanSm(window.innerWidth <= BREAKPOINT_SM)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Container>
      <LogoContainer>
        {isSmallerThanSm && (
          <img src={Logo} width={24} height={24} alt="Project Logo" />
        )}

        <Dialog.Root open={openViewBoardsModal}>
          <Dialog.Trigger asChild>
            <BoardNameContainer onClick={() => 
              isSmallerThanSm && (
                setOpenViewBoardsModal(true)
              )            
            }>
              <BoardName>Platform Launch</BoardName>
              {isSmallerThanSm && (
                <FontAwesomeIcon icon={faAngleDown} />
              )}
            </BoardNameContainer>
          </Dialog.Trigger>
          <ViewBoardsModal
            onChangeTheme={onChangeTheme}
            onClose={() => setOpenViewBoardsModal(false)}
          />
        </Dialog.Root>
      </LogoContainer>
      <OptionsContainer>
        <Dialog.Root open={openAddTaskModal}>
          <Dialog.Trigger asChild>
            <AddTaskBtn onClick={() => setOpenAddTaskModal(true)}>
              <FontAwesomeIcon icon={faPlus} />
              <p>+ Add New Task</p>
            </AddTaskBtn>
          </Dialog.Trigger>
          <AddTaskModal onClose={() => setOpenAddTaskModal(false)} />
        </Dialog.Root>

        <MoreOptionsWrapper>
          <Dialog.Root
            open={openMoreOptionsModal}
            onOpenChange={setOpenMoreOptionsModal}
          >
            <Dialog.Trigger asChild>
              <OpenMoreOptionsBtn>
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  onClick={() => setOpenMoreOptionsModal(false)}
                />
              </OpenMoreOptionsBtn>
            </Dialog.Trigger>
            <MoreOptionsModal onClose={() => setOpenMoreOptionsModal(false)} />
          </Dialog.Root>
        </MoreOptionsWrapper>
      </OptionsContainer>
    </Container>
  )
}
