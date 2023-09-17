import { useContext } from 'react'
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

interface AddColumnModalProps {
  onClose: () => void
}

export function BoardsModal({ onClose }: AddColumnModalProps) {
  const { activeBoard, allBoards } = useContext(BoardsContext)

  return (
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
              >
                <img src={IconBoard} alt="" />
                <p>{board.name}</p>
              </Board>
            )
          })}
          <Board className="create">
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
  )
}
