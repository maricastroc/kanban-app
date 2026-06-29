import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {
  BoardsContainer,
  BoardItem,
  ThemeSwitcherContainer,
  SwitchRoot,
  SwitchThumb,
} from './styles'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useEscapeKey } from '@/utils/useEscapeKey'
import BoardIcon from '@/../public/icon-board.svg'
import LightThemeSvg from '@/../public/icon-light-theme.svg'
import DarkThemeSvg from '@/../public/icon-dark-theme.svg'
import { BoardProps } from '@/@types/board'
import { BoardFormModal } from '../BoardFormModal'
import { useTheme } from '@/contexts/ThemeContext'
import Image from 'next/image'
import { BaseModal } from '../BaseModal'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'

interface BoardsDetailsModalProps {
  onClose: () => void
}

const BoardListItem = ({
  board,
  activeBoard,
  handleClickBoard,
}: {
  board: BoardProps | undefined
  activeBoard: BoardProps | undefined
  handleClickBoard: (board: BoardProps) => void
}) =>
  board && (
    <BoardItem
      key={board?.name}
      className={board?.name === activeBoard?.name ? 'active' : ''}
      onClick={() => handleClickBoard(board)}
    >
      <Image src={BoardIcon} alt="" />
      <p>{board?.name}</p>
    </BoardItem>
  )

export function BoardsDetailsModal({ onClose }: BoardsDetailsModalProps) {
  const { toggleTheme } = useTheme()

  const { activeBoard, boards, handleChangeActiveBoard } = useBoardsContext()

  const [addBoardModalOpen, setAddBoardModalOpen] = useState(false)

  useEscapeKey(onClose)

  const handleActivateBoard = async (board: BoardProps) => {
    try {
      const response = await api.patch(`boards/${board.id}/activate`)

      await handleChangeActiveBoard(response.data.data.board)
      onClose()
    } catch (error) {
      handleApiError(error)
    }
  }

  return (
    <BaseModal
      onClose={onClose}
      titlePadding="0 1.5rem"
      padding="1.5rem 0"
      title={`All Boards (${boards?.length || 0})`}
    >
      <BoardsContainer>
        {boards &&
          boards?.map((board) => (
            <BoardListItem
              key={board.name}
              board={board}
              activeBoard={activeBoard}
              handleClickBoard={handleActivateBoard}
            />
          ))}

        <Dialog.Root open={addBoardModalOpen}>
          <Dialog.Trigger asChild onClick={() => setAddBoardModalOpen(true)}>
            <BoardItem className="create">
              <Image src={BoardIcon} alt="" />
              <p>+ Create New Board</p>
            </BoardItem>
          </Dialog.Trigger>
          <BoardFormModal
            isEditing={false}
            onClose={() => setAddBoardModalOpen(false)}
          />
        </Dialog.Root>
      </BoardsContainer>

      <ThemeSwitcherContainer>
        <Image src={LightThemeSvg} alt="Dark theme" />
        <SwitchRoot
          className="SwitchRoot"
          id="airplane-mode"
          onClick={() => {
            toggleTheme()
          }}
        >
          <SwitchThumb className="SwitchThumb" />
        </SwitchRoot>
        <Image src={DarkThemeSvg} alt="Light theme" />
      </ThemeSwitcherContainer>
    </BaseModal>
  )
}
