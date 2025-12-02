/* eslint-disable @typescript-eslint/no-explicit-any */
import { BoardProps } from '@/@types/board'
import useRequest from '@/utils/useRequest'
import { AxiosResponse } from 'axios'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token')
      setIsAuthenticated(!!token)
    }

    checkAuth()

    window.addEventListener('storage', (e) => {
      if (e.key === 'auth_token') checkAuth()
    })
  }, [])

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const boardsRequest = token ? { url: '/boards', method: 'GET' } : null
  const activeBoardRequest = token
    ? { url: '/boards/active', method: 'GET' }
    : null

  const {
    data: boardsData,
    mutate: boardsMutate,
    isValidating: isValidatingBoards,
  } = useRequest<{ boards: BoardProps[] }>(boardsRequest)

  const {
    data: activeBoardData,
    mutate: activeBoardMutate,
    isValidating: isValidatingActiveBoard,
  } = useRequest<{ board: BoardProps }>(activeBoardRequest)
console.log(!isAuthenticated, isValidatingBoards, isValidatingActiveBoard)
  const isLoading =
    !isAuthenticated || isValidatingBoards || isValidatingActiveBoard

  useEffect(() => {
    if (boardsData?.boards) setBoards(boardsData.boards)
    else if (boardsData !== undefined) setBoards([])
  }, [boardsData])

  useEffect(() => {
    const isBoardStillInList = boards?.some(
      (b) => b.id === activeBoardData?.board?.id,
    )

    if (isBoardStillInList) {
      setActiveBoard(activeBoardData?.board)
    } else {
      setActiveBoard(undefined)
    }
  }, [activeBoardData, boards])

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
