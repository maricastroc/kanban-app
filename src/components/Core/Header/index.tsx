import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AddTaskBtn, BoardName, BoardNameContainer, Container, LogoContainer, OptionsContainer } from "./styles";
import Logo from '@/../public/icon.svg'
import { faAngleDown, faEllipsisVertical, faPlus } from "@fortawesome/free-solid-svg-icons";
import * as Dialog from '@radix-ui/react-dialog'
import { ViewBoardsModal } from "@/components/Modals/ViewBoardsModal";
import { useState } from "react";
import { AddTaskModal } from "@/components/Modals/AddTaskModal";

interface HeaderProps {
  onChangeTheme: () => void
}

export function Header({ onChangeTheme }: HeaderProps) {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)

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
            <AddTaskBtn onClick={() => setShowAddTaskModal(true)}>
              <FontAwesomeIcon icon={faPlus} />
            </AddTaskBtn>
          </Dialog.Trigger>
          <AddTaskModal onClose={() => setShowAddTaskModal(false)} />
        </Dialog.Root>

        <FontAwesomeIcon icon={faEllipsisVertical} />
      </OptionsContainer>
    </Container>
  )
}