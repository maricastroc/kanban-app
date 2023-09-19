import { useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'

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
import { AddBoard } from '../AddBoard'

interface ViewBoardsProps {
  onClose: () => void
}

export function ViewBoards({ onClose }: ViewBoardsProps) {
  const { activeBoard, allBoards, handleSetActiveBoard } = useBoardsContext()

  const [openAddBoard, setOpenAddBoard] = useState(false)

  return !openAddBoard ? (
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
              setOpenAddBoard(true)
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
    <AddBoard
      onClose={() => {
        setOpenAddBoard(false)
        onClose()
      }}
    />
  )
}
