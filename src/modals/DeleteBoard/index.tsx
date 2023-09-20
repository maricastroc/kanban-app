import { Button } from '@/components/Button'

import { ButtonsContainer, Description } from './styles'
import { Content, Overlay, Title } from '../sharedStyles'

import { useBoardsContext } from '@/contexts/BoardsContext'
import { BoardDTO } from '@/dtos/boardDTO'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'

interface DeleteBoardProps {
  board: BoardDTO
  onClose: () => void
}

export function DeleteBoard({ board, onClose }: DeleteBoardProps) {
  useEscapeKeyHandler(onClose)

  const { deleteBoard } = useBoardsContext()

  return (
    <>
      <Overlay onClick={() => onClose()} />
      <Content>
        <Title className="delete">Delete this board?</Title>
        <Description>
          <p>
            {`Are you sure you want to delete the ‘${board.name}’ board? This action will remove all columns and tasks and cannot be reversed.`}
          </p>
        </Description>

        <ButtonsContainer>
          <Button
            title="Delete"
            variant="tertiary"
            onClick={() => {
              deleteBoard(board)
              onClose()
            }}
          />
          <Button title="Cancel" variant="primary" onClick={() => onClose()} />
        </ButtonsContainer>
      </Content>
    </>
  )
}
