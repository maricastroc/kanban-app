import * as Dialog from '@radix-ui/react-dialog'

import {
  ModalTitle,
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
import { ModalContent, ModalOverlay } from '@/styles/shared'

interface ViewBoardsModalProps {
  onChangeTheme: () => void
  onClose: () => void
}

export function ViewBoardsModal({
  onChangeTheme,
  onClose,
}: ViewBoardsModalProps) {
  const { activeBoard, allBoards, enableDarkMode, handleEnableDarkMode, handleSetActiveBoard } =
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
      <ModalContent padding="1.5rem 0" className="DialogContent" aria-describedby={undefined}>
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
                onClick={() => handleClickBoard(board)}
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
              handleEnableDarkMode(!enableDarkMode)
              await wait()
              onClose()
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
