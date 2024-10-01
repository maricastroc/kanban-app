import * as Dialog from '@radix-ui/react-dialog'

import {
  ModalOverlay,
  ModalDescription,
  ModalTitle,
  ModalContent,
  BoardsContainer,
  BoardItem,
  ThemeSwitcherContainer,
  SwitchRoot,
  SwitchThumb
} from './styles'

import { useBoardsContext } from '@/contexts/BoardsContext'

import BoardIcon from '@/../public/icon-board.svg'
import LightThemeSvg from '@/../public/icon-light-theme.svg'
import DarkThemeSvg from '@/../public/icon-dark-theme.svg'

interface ViewBoardsModalProps {
  onChangeTheme: () => void
}

export function ViewBoardsModal({ onChangeTheme }: ViewBoardsModalProps) {
  const { activeBoard, allBoards, handleEnableDarkMode, handleSetActiveBoard } =
    useBoardsContext()

  return (
    <Dialog.Portal>
      <ModalOverlay className="DialogOverlay" />
      <ModalContent className="DialogContent">
        <ModalTitle className="DialogTitle">
          All Boards (5)
        </ModalTitle>
        <ModalDescription className="DialogDescription">

        <BoardsContainer>
          {allBoards.map((board) => {
            return (
              <BoardItem
                key={board.name}
                className={board.name === activeBoard?.name ? 'active' : ''}
                onClick={() => {
                  handleSetActiveBoard(board)
                }}
              >
                <img src={BoardIcon} alt="" />
                <p>{board.name}</p>
              </BoardItem>
            )
          })}
          <BoardItem
            className="create"
          >
            <img src={BoardIcon} alt="" />
            <p>+ Create New Board</p>
          </BoardItem>
        </BoardsContainer>

        <ThemeSwitcherContainer onClick={() => onChangeTheme()}>
          <img src={DarkThemeSvg} alt="" />
          <SwitchRoot
            className="SwitchRoot"
            id="airplane-mode"
            onClick={() => {
              handleEnableDarkMode()
            }}
          >
            <SwitchThumb className="SwitchThumb" />
          </SwitchRoot>
          <img src={LightThemeSvg} alt="" />
        </ThemeSwitcherContainer>

        </ModalDescription>
      </ModalContent>
    </Dialog.Portal>
  )
}
