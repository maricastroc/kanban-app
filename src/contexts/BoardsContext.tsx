/* eslint-disable @typescript-eslint/no-explicit-any */
import { BoardProps } from '@/@types/board'
import useRequest from '@/utils/useRequest'
import { useAuthUser } from '@/hooks/useAuthUser'
import { api } from '@/lib/axios'
import { AxiosResponse } from 'axios'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { KeyedMutator } from 'swr'

interface BoardsContextData {
  enableScrollFeature: boolean
  handleEnableScrollFeature: (value: boolean) => void

  isLoading: boolean
  handleChangeActiveBoard: (value: BoardProps) => Promise<void>

  activeBoard: BoardProps | undefined
  boards: BoardProps[] | null

  isValidatingBoards: boolean
  isValidatingActiveBoard: boolean

  boardsMutate: KeyedMutator<AxiosResponse<{ boards: BoardProps[] }, any>>
  activeBoardMutate: KeyedMutator<AxiosResponse<{ board: BoardProps }, any>>

  setBoards: (boards: BoardProps[] | null) => void
  setActiveBoard: (board: BoardProps | undefined) => void
}

const BoardsContext = createContext<BoardsContextData | undefined>(undefined)

export function useBoardsContext() {
  const context = useContext(BoardsContext)
  if (!context) {
    throw new Error(
      'useBoardsContext must be used within a BoardsContextProvider',
    )
  }
  return context
}

interface BoardsContextProviderProps {
  children: ReactNode
}

export function BoardsContextProvider({
  children,
}: BoardsContextProviderProps) {
  const [enableScrollFeature, setEnableScrollFeature] = useState(false)

  const [boards, setBoards] = useState<BoardProps[] | null>(null)

  const [activeBoard, setActiveBoard] = useState<BoardProps | undefined>()

  const { isAuthenticated } = useAuthUser()

  const boardsRequest = isAuthenticated
    ? { url: '/boards', method: 'GET' }
    : null
  const activeBoardRequest = isAuthenticated
    ? { url: '/boards/active', method: 'GET' }
    : null

  const {
    data: boardsData,
    mutate: boardsMutate,
    isValidating: isValidatingBoards,
    isLoading: isLoadingBoards,
  } = useRequest<{ boards: BoardProps[] }>(boardsRequest)

  const {
    data: activeBoardData,
    mutate: activeBoardMutate,
    isValidating: isValidatingActiveBoard,
    isLoading: isLoadingActiveBoard,
  } = useRequest<{ board: BoardProps }>(activeBoardRequest)

  // Only the *initial* fetch — background revalidations (mount, reconnect,
  // mutate) keep this false so the board stops flashing the full-screen loader.
  const isLoading = isLoadingBoards || isLoadingActiveBoard

  // Guards the one-shot auto-activation so it can't fire on every re-render.
  const autoActivatingRef = useRef(false)

  useEffect(() => {
    if (boardsData?.boards) setBoards(boardsData.boards)
    else if (boardsData !== undefined) setBoards([])
  }, [boardsData])

  useEffect(() => {
    // Wait until boards are loaded and the active-board probe has settled,
    // otherwise we'd clear the selection (or auto-activate) mid-fetch.
    if (!boards || isLoadingActiveBoard || autoActivatingRef.current) return

    const activeId = activeBoardData?.board?.id
    const matched =
      activeId != null
        ? boards.find((b) => String(b.id) === String(activeId))
        : undefined

    // The active board from the API already carries its columns → use it
    // directly. (The board view reads `activeBoard.columns`; the `/boards`
    // list endpoint omits columns, so a list item alone isn't enough.)
    if (matched && activeBoardData?.board?.columns) {
      setActiveBoard(activeBoardData.board)
      return
    }

    // Genuinely no boards → let the "create your first board" empty state show.
    if (boards.length === 0) {
      setActiveBoard(undefined)
      return
    }

    // Boards exist but we don't have a board-with-columns yet (none active, the
    // active one was deleted, or the probe returned one without columns).
    // Activate the target board to fetch its full detail with columns, so the
    // user lands on a real board instead of the empty state.
    const targetId = matched ? activeId : boards[0].id
    autoActivatingRef.current = true
    api
      .patch(`boards/${targetId}/activate`)
      .then((res) => {
        const board = res?.data?.data?.board ?? boards[0]
        setActiveBoard({ ...board, columns: board.columns ?? [] })
      })
      .catch(() => {
        // Last resort: land on the first board even without its columns yet.
        setActiveBoard({ ...boards[0], columns: boards[0].columns ?? [] })
      })
      .finally(() => {
        autoActivatingRef.current = false
      })
  }, [activeBoardData, boards, isLoadingActiveBoard])

  const handleEnableScrollFeature = (value: boolean) => {
    setEnableScrollFeature(value)
  }

  const handleChangeActiveBoard = async (board: BoardProps) => {
    setActiveBoard(board)
    await activeBoardMutate()
  }

  return (
    <BoardsContext.Provider
      value={{
        enableScrollFeature,
        handleEnableScrollFeature,
        isLoading,
        handleChangeActiveBoard,
        activeBoard,
        boards,
        isValidatingBoards,
        isValidatingActiveBoard,
        boardsMutate,
        activeBoardMutate,
        setActiveBoard,
        setBoards,
      }}
    >
      {children}
    </BoardsContext.Provider>
  )
}
