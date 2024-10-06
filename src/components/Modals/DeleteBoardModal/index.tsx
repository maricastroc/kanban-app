import { ButtonsContainer, ModalDescription } from './styles'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { Button } from '@/components/Shared/Button'
import { BoardProps } from '@/@types/board'
import { ModalContent, ModalOverlay, ModalTitle } from '@/styles/shared'

interface DeleteBoardProps {
  board: BoardProps
  onClose: () => void
}

export function DeleteBoard({ board, onClose }: DeleteBoardProps) {
  const { deleteBoard } = useBoardsContext()

  return (
    <>
      <ModalOverlay className="DialogOverlay" onClick={() => onClose()} />
      <ModalContent className="delete">
        <ModalTitle className="delete">Delete this board?</ModalTitle>
        <ModalDescription>
          <span>
            {`Are you sure you want to delete the ‘${board.name}’ board? This action will remove all columns and tasks and cannot be reversed.`}
          </span>
        </ModalDescription>

        <ButtonsContainer>
          <Button
            title="Delete"
            variant="tertiary"
            onClick={() => {
              deleteBoard(board)
              onClose()
            }}
          />
          <Button
            title="Cancel"
            variant="secondary"
            onClick={() => onClose()}
          />
        </ButtonsContainer>
      </ModalContent>
    </>
  )
}
