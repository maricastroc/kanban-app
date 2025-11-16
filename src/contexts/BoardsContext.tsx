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
  handleSetIsLoading: (value: boolean) => void
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
  const [isLoading, setIsLoading] = useState(true)
  const [enableScrollFeature, setEnableScrollFeature] = useState(false)
  const [boards, setBoards] = useState<BoardProps[] | null>(null)
  const [activeBoard, setActiveBoard] = useState<BoardProps | undefined>()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true)
      const token = localStorage.getItem('auth_token')
      setIsAuthenticated(!!token)
    }

    checkAuth()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const boardsRequest = token
    ? { url: '/boards', method: 'GET' }
    : null

  const activeBoardRequest = token
    ? { url: '/boards/active', method: 'GET' }
    : null

  const {
    data: boardsData,
    mutate: boardsMutate,
    isValidating: isValidatingBoards,
  } = useRequest<{ boards: BoardProps[] }>(boardsRequest, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
  })

  const {
    data: activeBoardData,
    mutate: activeBoardMutate,
    isValidating: isValidatingActiveBoard,
  } = useRequest<{ board: BoardProps }>(activeBoardRequest, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
  })

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true)
      Promise.all([boardsMutate(), activeBoardMutate()]).finally(() =>
        setIsLoading(false),
      )
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, boardsMutate, activeBoardMutate])

  useEffect(() => {
    if (boardsData !== undefined) {
      if (boardsData?.boards) {
        setBoards(boardsData.boards)
      } else {
        setBoards([])
      }
    }
  }, [boardsData])

  useEffect(() => {
    const isBoardStillInList = boards?.some(
      (b) => b.id === activeBoardData?.board.id,
    )

    if (isBoardStillInList) {
      setActiveBoard(activeBoardData?.board)
    } else {
      setActiveBoard(undefined)
    }
  }, [activeBoardData, boards])
console.log(boardsData)
  const handleEnableScrollFeature = (value: boolean) => {
    setEnableScrollFeature(value)
  }

  const handleSetIsLoading = (value: boolean) => {
    setIsLoading(value)
  }

  const handleChangeActiveBoard = async (board: BoardProps) => {
    setIsLoading(true)
    setActiveBoard(board)
    await activeBoardMutate()
    setIsLoading(false)
  }

  return (
    <BoardsContext.Provider
      value={{
        enableScrollFeature,
        handleEnableScrollFeature,
        isLoading,
        handleSetIsLoading,
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
