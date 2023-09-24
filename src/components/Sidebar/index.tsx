import { useBoardsContext } from '@/contexts/BoardsContext'
import {
  Board,
  BoardsContainer,
  Container,
  HideButton,
  OptionsContainer,
  SwitchRoot,
  SwitchThumb,
  ThemeSwitcherContainer,
  Title,
  Wrapper,
} from './styles'

import IconBoard from '../../../public/icon-board.svg'
import LightThemeSvg from '../../../public/icon-light-theme.svg'
import DarkThemeSvg from '../../../public/icon-dark-theme.svg'
import { useState } from 'react'
import { AddBoard } from '@/modals/AddBoard'
import { EyeSlash } from 'phosphor-react'

interface SidebarProps {
  onClose: () => void
  onChangeTheme: () => void
}

export function Sidebar({ onClose, onChangeTheme }: SidebarProps) {
  const { allBoards, activeBoard, handleSetActiveBoard } = useBoardsContext()

  const [openAddBoard, setOpenAddBoard] = useState(false)

  return (
    <Container>
      {openAddBoard && (
        <AddBoard
          onClose={() => {
            setOpenAddBoard(false)
          }}
        />
      )}
      <Wrapper>
        <Title>{`All Boards (${allBoards.length})`}</Title>
        <BoardsContainer>
          {allBoards.map((board) => {
            return (
              <Board
                key={board.name}
                className={board.name === activeBoard.name ? 'active' : ''}
                onClick={() => {
                  handleSetActiveBoard(board)
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
      </Wrapper>
      <OptionsContainer>
        <ThemeSwitcherContainer>
          <img src={DarkThemeSvg} alt="" />
          <SwitchRoot
            className="SwitchRoot"
            id="airplane-mode"
            onClick={() => onChangeTheme()}
          >
            <SwitchThumb className="SwitchThumb" />
          </SwitchRoot>
          <img src={LightThemeSvg} alt="" />
        </ThemeSwitcherContainer>
        <HideButton onClick={onClose}>
          <EyeSlash />
          <p>Hide Sidebar</p>
        </HideButton>
      </OptionsContainer>
    </Container>
  )
}
