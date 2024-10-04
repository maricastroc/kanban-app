import * as Dialog from '@radix-ui/react-dialog'

import {
  ModalOverlay,
  ModalTitle,
  ModalContent,
  BoardsContainer,
  BoardItem,
  ThemeSwitcherContainer,
  SwitchRoot,
  SwitchThumb,
} from './styles'

import { useBoardsContext } from '@/contexts/BoardsContext'

import BoardIcon from '@/../public/icon-board.svg'
import LightThemeSvg from '@/../public/icon-light-theme.svg'
import DarkThemeSvg from '@/../public/icon-dark-theme.svg'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { AddBoardModal } from '../AddBoardModal'
import { useState } from 'react'
import { BoardProps } from '@/@types/board'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'

interface ViewBoardsModalProps {
  onChangeTheme: () => void
  onClose: () => void
}

export function ViewBoardsModal({
  onChangeTheme,
  onClose,
}: ViewBoardsModalProps) {
  const { activeBoard, allBoards, handleEnableDarkMode, handleSetActiveBoard } =
    useBoardsContext()

  const [openAddBoardModal, setOpenAddBoardModal] = useState(false)

  useEscapeKeyHandler(onClose)

  const wait = () => new Promise((resolve) => setTimeout(resolve, 100))

  const handleClickBoard = async (board: BoardProps) => {
    handleSetActiveBoard(board)
    await wait()
    onClose()
  }

  return (
    <Dialog.Portal>
      <ModalOverlay className="DialogOverlay" onClick={() => onClose()} />
      <ModalContent className="DialogContent" aria-describedby={undefined}>
        <ModalTitle className="DialogTitle">All Boards (5)</ModalTitle>
        <VisuallyHidden>
          <Dialog.Description />
        </VisuallyHidden>
        <BoardsContainer>
          {allBoards.map((board) => {
            return (
              <BoardItem
                key={board.name}
                className={board.name === activeBoard?.name ? 'active' : ''}
                onClick={() => handleClickBoard(board)} // Função assíncrona para setar o board e fechar o modal
              >
                <img src={BoardIcon} alt="" />
                <p>{board.name}</p>
              </BoardItem>
            )
          })}

          <Dialog.Root open={openAddBoardModal}>
            <Dialog.Trigger asChild onClick={() => setOpenAddBoardModal(true)}>
              <BoardItem className="create" onClick={() => setOpenAddBoardModal(true)}>
                <img src={BoardIcon} alt="" />
                <p>+ Create New Board</p>
              </BoardItem>
            </Dialog.Trigger>
            <AddBoardModal onClose={() => setOpenAddBoardModal(false)} />
          </Dialog.Root>
        </BoardsContainer>

        <ThemeSwitcherContainer onClick={() => onChangeTheme()}>
          <img src={DarkThemeSvg} alt="" />
          <SwitchRoot
            className="SwitchRoot"
            id="airplane-mode"
            onClick={async () => {
              handleEnableDarkMode() // Ativa o modo escuro
              await wait() // Espera 1 segundo
              onClose() // Fecha o modal
            }}
          >
            <SwitchThumb className="SwitchThumb" />
          </SwitchRoot>
          <img src={LightThemeSvg} alt="" />
        </ThemeSwitcherContainer>
      </ModalContent>
    </Dialog.Portal>
  )
}
