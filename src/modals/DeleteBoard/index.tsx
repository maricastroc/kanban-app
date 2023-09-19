import { Button } from '@/components/Button'

import {
  Overlay,
  Description,
  Title,
  Content,
  ButtonsContainer,
} from './styles'

import { useBoardsContext } from '@/contexts/BoardsContext'
import { BoardDTO } from '@/dtos/boardDTO'

interface DeleteBoardProps {
  board: BoardDTO
  onClose: () => void
}

export function DeleteBoard({ board, onClose }: DeleteBoardProps) {
  const { deleteBoard } = useBoardsContext()

  return (
    <>
      <Overlay onClick={() => onClose()} />
      <Content>
        <Title>
          <h3>Delete this board?</h3>
        </Title>
        <Description className="DialogDescription">
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
