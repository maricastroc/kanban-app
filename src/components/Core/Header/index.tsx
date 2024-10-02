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
import { useState } from 'react'
import { AddTaskModal } from '@/components/Modals/AddTaskModal'
import { MoreOptionsModal } from '@/components/Modals/MoreOptionsModal'

interface HeaderProps {
  onChangeTheme: () => void
}

export function Header({ onChangeTheme }: HeaderProps) {
  const [, setShowAddTaskModal] = useState(false)

  return (
    <Container>
      <LogoContainer>
        <img src={Logo} width={24} height={24} alt="Project Logo" />

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <BoardNameContainer>
              <BoardName>Platform Launch</BoardName>
              <FontAwesomeIcon icon={faAngleDown} />
            </BoardNameContainer>
          </Dialog.Trigger>
          <ViewBoardsModal onChangeTheme={onChangeTheme} />
        </Dialog.Root>
      </LogoContainer>
      <OptionsContainer>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <AddTaskBtn>
              <FontAwesomeIcon icon={faPlus} />
            </AddTaskBtn>
          </Dialog.Trigger>
          <AddTaskModal onClose={() => setShowAddTaskModal(false)} />
        </Dialog.Root>

        <MoreOptionsWrapper>
          <Dialog.Root>
          <Dialog.Trigger asChild>
            <OpenMoreOptionsBtn>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </OpenMoreOptionsBtn>
          </Dialog.Trigger>
          <MoreOptionsModal />
        </Dialog.Root>
        </MoreOptionsWrapper>
      </OptionsContainer>
    </Container>
  )
}
