import { useBoardsContext } from '@/contexts/BoardsContext'
import { useTheme } from '@/contexts/ThemeContext'
import { getBoardAvatarStyle } from '@/utils/getBoardColor'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'
import { BoardProps } from '@/@types/board'
import {
  BoardButton,
  BoardIcon,
  BoardsContainer,
  EmptyBoardsHint,
} from './styles'

const getBoardTaskCount = (board: BoardProps) =>
  board.columns?.reduce(
    (total, column) => total + (column.tasks?.length || 0),
    0,
  ) || 0

interface BoardListProps {
  // Called after a board is activated — lets a host (e.g. the mobile sheet)
  // close itself. The sidebar leaves it undefined and stays put.
  onNavigate?: () => void
}

// Shared board navigation list used by both the desktop sidebar and the mobile
// boards sheet, so the two can't drift apart in look or behavior.
export function BoardList({ onNavigate }: BoardListProps) {
  const { boards, activeBoard, handleChangeActiveBoard } = useBoardsContext()
  const { enableDarkMode } = useTheme()

  const handleActivateBoard = async (board: BoardProps) => {
    try {
      const response = await api.patch(`boards/${board.id}/activate`)
      await handleChangeActiveBoard(response.data.data.board)
      onNavigate?.()
    } catch (error) {
      handleApiError(error)
    }
  }

  return (
    <BoardsContainer>
      {!boards?.length && (
        <EmptyBoardsHint>No boards yet — create one below.</EmptyBoardsHint>
      )}
      {boards?.map((board) => {
        const taskCount = getBoardTaskCount(board)
        return (
          <BoardButton
            key={board.name}
            className={board.name === activeBoard?.name ? 'active' : ''}
            onClick={() => handleActivateBoard(board)}
          >
            <BoardIcon style={getBoardAvatarStyle(board.name, enableDarkMode)}>
              {board.name.charAt(0).toUpperCase()}
            </BoardIcon>
            <p>{board.name}</p>
            {taskCount > 0 && <span className="count">{taskCount}</span>}
          </BoardButton>
        )
      })}
    </BoardsContainer>
  )
}
