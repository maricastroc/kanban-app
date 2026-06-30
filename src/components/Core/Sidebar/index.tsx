import {
  BoardButton,
  BoardIcon,
  BoardsContainer,
  Brand,
  Container,
  CreateBoardArea,
  CreateBoardButton,
  CreateDivider,
  EmptyBoardsHint,
  HideButton,
  OptionsContainer,
  SectionLabel,
  SwitchRoot,
  SwitchThumb,
  ThemeSwitcherContainer,
  Wrapper,
} from './styles'
import * as Dialog from '@radix-ui/react-dialog'

import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTableColumns,
  faPlus,
  faEyeSlash,
  faMoon,
  faSun,
} from '@fortawesome/free-solid-svg-icons'
import { BoardFormModal } from '@/components/Modals/BoardFormModal'
import { useTheme } from '@/contexts/ThemeContext'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { handleApiError } from '@/utils/handleApiError'
import { getBoardColor } from '@/utils/getBoardColor'
import { api } from '@/lib/axios'
import { BoardProps } from '@/@types/board'

interface SidebarProps {
  onClose: () => void
  className?: string
}

const getBoardTaskCount = (board: BoardProps) =>
  board.columns?.reduce(
    (total, column) => total + (column.tasks?.length || 0),
    0,
  ) || 0

export function Sidebar({ onClose, className }: SidebarProps) {
  const { toggleTheme, enableDarkMode } = useTheme()

  const { handleChangeActiveBoard, activeBoard, boards } = useBoardsContext()

  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false)

  const handleActivateBoard = async (board: BoardProps) => {
    try {
      const response = await api.patch(`boards/${board.id}/activate`)

      await handleChangeActiveBoard(response.data.data.board)
    } catch (error) {
      handleApiError(error)
    }
  }

  return (
    <Container className={className}>
      <Wrapper className={className}>
        <Brand>
          <span className="logo-mark">
            <FontAwesomeIcon
              icon={faTableColumns}
              style={{ fontSize: '0.9rem' }}
            />
          </span>
          <span>kanban</span>
        </Brand>

        <SectionLabel>
          <span>Boards</span>
          <span>{boards?.length || 0}</span>
        </SectionLabel>

        <BoardsContainer>
          {!boards?.length && (
            <EmptyBoardsHint>No boards yet — create one below.</EmptyBoardsHint>
          )}
          {boards?.map((board) => {
            const taskCount = getBoardTaskCount(board)
            const color = getBoardColor(board.name)
            return (
              <BoardButton
                key={board.name}
                className={board.name === activeBoard?.name ? 'active' : ''}
                onClick={() => {
                  handleActivateBoard(board)
                }}
              >
                <BoardIcon style={{ backgroundColor: `${color}22`, color }}>
                  {board.name.charAt(0).toUpperCase()}
                </BoardIcon>
                <p>{board.name}</p>
                {taskCount > 0 && <span className="count">{taskCount}</span>}
              </BoardButton>
            )
          })}
        </BoardsContainer>

        <CreateBoardArea>
          <CreateDivider />

          <Dialog.Root open={isAddBoardModalOpen}>
            <Dialog.Trigger asChild>
              <CreateBoardButton
                className="create"
                onClick={() => {
                  setIsAddBoardModalOpen(true)
                }}
              >
                <span className="plus-box">
                  <FontAwesomeIcon icon={faPlus} />
                </span>
                <p>Create board</p>
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
        </CreateBoardArea>
      </Wrapper>

      <OptionsContainer>
        <ThemeSwitcherContainer>
          <FontAwesomeIcon icon={faMoon} />
          <SwitchRoot
            className="SwitchRoot"
            id="theme-switch"
            checked={!enableDarkMode}
            onCheckedChange={() => {
              toggleTheme()
            }}
          >
            <SwitchThumb className="SwitchThumb" />
          </SwitchRoot>
          <FontAwesomeIcon icon={faSun} />
        </ThemeSwitcherContainer>
        <HideButton onClick={onClose}>
          <FontAwesomeIcon icon={faEyeSlash} />
          <p>Hide sidebar</p>
        </HideButton>
      </OptionsContainer>
    </Container>
  )
}
