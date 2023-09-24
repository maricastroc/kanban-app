import { useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'

import {
  Title,
  Content,
  BoardsContainer,
  Board,
  ThemeSwitcherContainer,
  SwitchThumb,
  SwitchRoot,
} from './styles'

import { Overlay } from '../sharedStyles'
import { AddBoard } from '../AddBoard'

import IconBoard from '../../../public/icon-board.svg'
import LightThemeSvg from '../../../public/icon-light-theme.svg'
import DarkThemeSvg from '../../../public/icon-dark-theme.svg'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'

interface ViewBoardsProps {
  onClose: () => void
  onChangeTheme: () => void
}

export function ViewBoards({ onClose, onChangeTheme }: ViewBoardsProps) {
  useEscapeKeyHandler(onClose)

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
        <ThemeSwitcherContainer onClick={() => onChangeTheme()}>
          <img src={DarkThemeSvg} alt="" />
          <SwitchRoot
            className="SwitchRoot"
            id="airplane-mode"
            onClick={() => {
              onChangeTheme()
            }}
          >
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
