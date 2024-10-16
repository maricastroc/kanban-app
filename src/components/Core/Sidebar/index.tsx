import { useBoardsContext } from '@/contexts/BoardsContext'
import {
  BoardBtn,
  BoardsContainer,
  Container,
  CreateBoardBtn,
  HideButton,
  LogoWrapper,
  OptionsContainer,
  SwitchRoot,
  SwitchThumb,
  ThemeSwitcherContainer,
  Title,
  Wrapper,
} from './styles'
import * as Dialog from '@radix-ui/react-dialog'

import IconBoard from '@/../public/icon-board.svg'
import LightThemeSvg from '@/../public/icon-light-theme.svg'
import DarkThemeSvg from '@/../public/icon-dark-theme.svg'
import Logo from '@/../public/icon.svg'
import LogoTextLight from '@/../public/kanban.svg'
import LogoTextDark from '@/../public/kanban-dark.svg'
import { useState } from 'react'

import { EyeSlash } from 'phosphor-react'
import { BoardFormModal } from '@/components/Modals/BoardFormModal'

interface SidebarProps {
  onClose: () => void
  onChangeTheme: () => void
}

export function Sidebar({ onClose, onChangeTheme }: SidebarProps) {
  const {
    allBoards,
    activeBoard,
    enableDarkMode,
    handleSetActiveBoard,
    handleEnableDarkMode,
  } = useBoardsContext()

  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false)

  return (
    <Container>
      <Wrapper>
        <LogoWrapper>
          <img src={Logo} width={24} height={24} alt="" />
          <img
            src={enableDarkMode ? LogoTextLight : LogoTextDark}
            width={112}
            height={24}
            alt=""
          />
        </LogoWrapper>
        <Title>{`All Boards (${allBoards.length})`}</Title>
        <BoardsContainer>
          {allBoards.map((board) => {
            return (
              <BoardBtn
                key={board.name}
                className={board.name === activeBoard?.name ? 'active' : ''}
                onClick={() => {
                  handleSetActiveBoard(board)
                }}
              >
                <img src={IconBoard} alt="" />
                <p>{board.name}</p>
              </BoardBtn>
            )
          })}
          <Dialog.Root open={isAddBoardModalOpen}>
            <Dialog.Trigger asChild>
              <CreateBoardBtn
                className="create"
                onClick={() => {
                  setIsAddBoardModalOpen(true)
                }}
              >
                <img src={IconBoard} alt="" />
                <p>+ Create New Board</p>
              </CreateBoardBtn>
            </Dialog.Trigger>
            {isAddBoardModalOpen && (
              <BoardFormModal
                isEditing={false}
                onClose={() => {
                  setIsAddBoardModalOpen(false)
                }}
              />
            )}
          </Dialog.Root>
        </BoardsContainer>
      </Wrapper>
      <OptionsContainer>
        <ThemeSwitcherContainer>
          <img src={LightThemeSvg} alt="" />
          <SwitchRoot
            className="SwitchRoot"
            id="airplane-mode"
            onClick={() => {
              onChangeTheme()
              handleEnableDarkMode(!enableDarkMode)
            }}
          >
            <SwitchThumb className="SwitchThumb" />
          </SwitchRoot>
          <img src={DarkThemeSvg} alt="" />
        </ThemeSwitcherContainer>
        <HideButton onClick={onClose}>
          <EyeSlash />
          <p>Hide Sidebar</p>
        </HideButton>
      </OptionsContainer>
    </Container>
  )
}
