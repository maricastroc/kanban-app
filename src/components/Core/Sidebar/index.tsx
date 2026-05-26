import {
  BoardButton,
  BoardsContainer,
  Container,
  CreateBoardButton,
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
import LogoTextLight from '../../../../public/kanban.svg'
import LogoTextDark from '../../../../public/kanban-dark.svg'
import { useState } from 'react'

import { EyeSlash } from 'phosphor-react'
import { BoardFormModal } from '@/components/Modals/BoardFormModal'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleTheme } from '@/store/themeSlice'
import { fetchActiveBoard, setActiveBoard } from '@/store/boardsSlice'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'
import { BoardProps } from '@/@types/board'

interface SidebarProps {
  onClose: () => void
  className?: string
}

export function Sidebar({ onClose, className }: SidebarProps) {
  const dispatch = useAppDispatch()
  const enableDarkMode = useAppSelector((state) => state.theme.enableDarkMode)
  const activeBoard = useAppSelector((state) => state.boards.activeBoard)
  const boards = useAppSelector((state) => state.boards.boards)

  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false)

  const handleActivateBoard = async (board: BoardProps) => {
    try {
      const response = await api.patch(`boards/${board.id}/activate`)

      dispatch(setActiveBoard(response.data.data.board))
      dispatch(fetchActiveBoard())
    } catch (error) {
      handleApiError(error)
    }
  }

  return (
    <Container className={className}>
      <Wrapper className={className}>
        <LogoWrapper>
          <Image src={Logo} width={24} height={24} alt="" />
          <Image
            src={enableDarkMode ? LogoTextLight : LogoTextDark}
            width={112}
            height={24}
            className="logo"
            alt=""
          />
        </LogoWrapper>
        <Title>{`All Boards (${boards?.length || 0})`}</Title>
        <BoardsContainer>
          {boards?.map((board) => {
            return (
              <BoardButton
                key={board.name}
                className={board.name === activeBoard?.name ? 'active' : ''}
                onClick={() => {
                  handleActivateBoard(board)
                }}
              >
                <Image src={IconBoard} alt="" />
                <p>{board.name}</p>
              </BoardButton>
            )
          })}
          <Dialog.Root open={isAddBoardModalOpen}>
            <Dialog.Trigger asChild>
              <CreateBoardButton
                className="create"
                onClick={() => {
                  setIsAddBoardModalOpen(true)
                }}
              >
                <Image src={IconBoard} alt="" />
                <p>+ Create New Board</p>
              </CreateBoardButton>
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
          <Image src={DarkThemeSvg} alt="" />
          <SwitchRoot
            className="SwitchRoot"
            id="airplane-mode"
            onClick={() => {
              dispatch(toggleTheme())
            }}
          >
            <SwitchThumb className="SwitchThumb" />
          </SwitchRoot>
          <Image src={LightThemeSvg} alt="" />
        </ThemeSwitcherContainer>
        <HideButton onClick={onClose}>
          <EyeSlash />
          <p>Hide Sidebar</p>
        </HideButton>
      </OptionsContainer>
    </Container>
  )
}


if (process.env.NODE_ENV === 'development') {
  Sidebar.whyDidYouRender = true
}
