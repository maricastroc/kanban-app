/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

import {
  ModalTitle,
  BoardsContainer,
  BoardItem,
  ThemeSwitcherContainer,
  SwitchRoot,
  SwitchThumb,
} from './styles'

import { useBoardsContext } from '@/contexts/BoardsContext'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'
import { ModalContent, ModalOverlay } from '@/styles/shared'

import BoardIcon from '@/../public/icon-board.svg'
import LightThemeSvg from '@/../public/icon-light-theme.svg'
import DarkThemeSvg from '@/../public/icon-dark-theme.svg'

import { BoardProps } from '@/@types/board'
import { simulateDelay } from '@/utils/simulateDelay'
import { BoardFormModal } from '../BoardFormModal'
import { useTheme } from '@/contexts/ThemeContext'
import { KeyedMutator } from 'swr'
import { AxiosResponse } from 'axios'
import Image from 'next/image'

interface BoardsDetailsModalProps {
  onClose: () => void
  mutate: KeyedMutator<AxiosResponse<BoardProps, any>>
  boardsMutate: KeyedMutator<AxiosResponse<BoardProps[], any>>
  activeBoard: BoardProps | undefined
  boards: BoardProps[] | undefined
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

export function BoardsDetailsModal({
  onClose,
  mutate,
  activeBoard,
  boards,
  boardsMutate,
}: BoardsDetailsModalProps) {
  const { handleSetActiveBoard } = useBoardsContext()

  const { toggleTheme } = useTheme()

  const [addBoardModalOpen, setAddBoardModalOpen] = useState(false)

  useEscapeKeyHandler(onClose)

  const handleClickBoard = async (board: BoardProps) => {
    handleSetActiveBoard(board)
    await simulateDelay()
    onClose()
  }

  return (
    <Dialog.Portal>
      <ModalOverlay className="DialogOverlay" onClick={onClose} />
      <ModalContent padding="1.5rem 0" className="DialogContent">
        <ModalTitle className="DialogTitle">
          {`All Boards (${boards?.length || 0})`}
        </ModalTitle>

        <VisuallyHidden>
          <Dialog.Description />
        </VisuallyHidden>

        <BoardsContainer>
          {boards &&
            boards?.map((board) => (
              <BoardListItem
                key={board.name}
                board={board}
                activeBoard={activeBoard}
                handleClickBoard={handleClickBoard}
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
              mutate={mutate}
              boardsMutate={boardsMutate}
              activeBoard={activeBoard as BoardProps}
              onClose={() => setAddBoardModalOpen(false)}
            />
          </Dialog.Root>
        </BoardsContainer>

        <ThemeSwitcherContainer onClick={toggleTheme}>
          <Image src={DarkThemeSvg} alt="Dark theme" />
          <SwitchRoot
            className="SwitchRoot"
            id="airplane-mode"
            onClick={async () => {
              toggleTheme()
              await simulateDelay()
              onClose()
            }}
          >
            <SwitchThumb className="SwitchThumb" />
          </SwitchRoot>
          <Image src={LightThemeSvg} alt="Light theme" />
        </ThemeSwitcherContainer>
      </ModalContent>
    </Dialog.Portal>
  )
}
