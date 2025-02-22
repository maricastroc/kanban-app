import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

import {
  ModalTitle,
  BoardsContainer,
  BoardItem,
  ThemeSwitcherContainer,
  SwitchRoot,
  SwitchThumb,
} from './styles'

import { useBoardsContext } from '@/contexts/BoardsContext'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'
import { ModalContent, ModalOverlay } from '@/styles/shared'

import BoardIcon from '@/../public/icon-board.svg'
import LightThemeSvg from '@/../public/icon-light-theme.svg'
import DarkThemeSvg from '@/../public/icon-dark-theme.svg'

import { BoardProps } from '@/@types/board'
import { simulateDelay } from '@/utils/simulateDelay'
import { BoardFormModal } from '../BoardFormModal'

interface BoardsDetailsModalProps {
  onChangeTheme: () => void
  onClose: () => void
}

const BoardListItem = ({
  board,
  activeBoard,
  handleClickBoard,
}: {
  board: BoardProps
  activeBoard: BoardProps | null
  handleClickBoard: (board: BoardProps) => void
}) => (
  <BoardItem
    key={board.name}
    className={board.name === activeBoard?.name ? 'active' : ''}
    onClick={() => handleClickBoard(board)}
  >
    <img src={BoardIcon} alt="" />
    <p>{board.name}</p>
  </BoardItem>
)

export function BoardsDetailsModal({
  onChangeTheme,
  onClose,
}: BoardsDetailsModalProps) {
  const {
    activeBoard,
    allBoards,
    enableDarkMode,
    handleEnableDarkMode,
    handleSetActiveBoard,
  } = useBoardsContext()

  const [addBoardModalOpen, setAddBoardModalOpen] = useState(false)

  useEscapeKeyHandler(onClose)

  const handleClickBoard = async (board: BoardProps) => {
    handleSetActiveBoard(board)
    await simulateDelay()
    onClose()
  }

  return (
    <Dialog.Portal>
      <ModalOverlay className="DialogOverlay" onClick={onClose} />
      <ModalContent padding="1.5rem 0" className="DialogContent">
        <ModalTitle className="DialogTitle">
          {`All Boards (${allBoards.length})`}
        </ModalTitle>

        <VisuallyHidden>
          <Dialog.Description />
        </VisuallyHidden>

        <BoardsContainer>
          {allBoards.map((board) => (
            <BoardListItem
              key={board.name}
              board={board}
              activeBoard={activeBoard}
              handleClickBoard={handleClickBoard}
            />
          ))}

          <Dialog.Root open={addBoardModalOpen}>
            <Dialog.Trigger asChild onClick={() => setAddBoardModalOpen(true)}>
              <BoardItem className="create">
                <img src={BoardIcon} alt="" />
                <p>+ Create New Board</p>
              </BoardItem>
            </Dialog.Trigger>
            <BoardFormModal
              isEditing={false}
              onClose={() => setAddBoardModalOpen(false)}
            />
          </Dialog.Root>
        </BoardsContainer>

        <ThemeSwitcherContainer onClick={onChangeTheme}>
          <img src={DarkThemeSvg} alt="Dark theme" />
          <SwitchRoot
            className="SwitchRoot"
            id="airplane-mode"
            onClick={async () => {
              handleEnableDarkMode(!enableDarkMode)
              await simulateDelay()
              onClose()
            }}
          >
            <SwitchThumb className="SwitchThumb" />
          </SwitchRoot>
          <img src={LightThemeSvg} alt="Light theme" />
        </ThemeSwitcherContainer>
      </ModalContent>
    </Dialog.Portal>
  )
}
