import { useContext, useState } from 'react'
import { BoardsContext } from '@/contexts/BoardsContext'

import {
  Overlay,
  Title,
  Content,
  BoardsContainer,
  Board,
  ThemeSwitcherContainer,
  SwitchThumb,
  SwitchRoot,
} from './styles'

import IconBoard from '../../../public/icon-board.svg'

import LightThemeSvg from '../../../public/icon-light-theme.svg'
import DarkThemeSvg from '../../../public/icon-dark-theme.svg'
import { AddBoardModal } from '../AddBoardModal'

interface AddColumnModalProps {
  onClose: () => void
}

export function BoardsModal({ onClose }: AddColumnModalProps) {
  const { activeBoard, allBoards, handleSetActiveBoard } =
    useContext(BoardsContext)

  const [openAddBoardModal, setOpenAddBoardModal] = useState(false)

  return !openAddBoardModal ? (
    <>
      <Overlay onClick={() => onClose()} />
      <Content>
        <Title>
          <h3>{`All Boards (${allBoards.length})`}</h3>
        </Title>
        <BoardsContainer>
          {allBoards.map((board) => {
            return (
              <Board
                key={board.name}
                className={board.name === activeBoard.name ? 'active' : ''}
                onClick={() => {
                  handleSetActiveBoard(board)
                  onClose()
                }}
              >
                <img src={IconBoard} alt="" />
                <p>{board.name}</p>
              </Board>
            )
          })}
          <Board
            className="create"
            onClick={() => {
              setOpenAddBoardModal(true)
            }}
          >
            <img src={IconBoard} alt="" />
            <p>+ Create New Board</p>
          </Board>
        </BoardsContainer>
        <ThemeSwitcherContainer>
          <img src={DarkThemeSvg} alt="" />
          <SwitchRoot className="SwitchRoot" id="airplane-mode">
            <SwitchThumb className="SwitchThumb" />
          </SwitchRoot>
          <img src={LightThemeSvg} alt="" />
        </ThemeSwitcherContainer>
      </Content>
    </>
  ) : (
    <AddBoardModal
      onClose={() => {
        setOpenAddBoardModal(false)
        onClose()
      }}
    />
  )
}
