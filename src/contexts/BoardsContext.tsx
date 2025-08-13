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

  const boardsRequest = {
    url: '/boards',
    method: 'GET',
    shouldFetch: isAuthenticated,
  }

  const activeBoardRequest = {
    url: '/boards/active',
    method: 'GET',
    shouldFetch: isAuthenticated,
  }

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
      Promise.all([boardsMutate(), activeBoardMutate()])
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, boardsMutate, activeBoardMutate])

  useEffect(() => {
    if (typeof window === 'undefined') return

    setIsLoading(true)
    try {
      const storedBoards = localStorage.getItem('boards')
      if (storedBoards) {
        setBoards(JSON.parse(storedBoards))
      }

      const storedActiveBoard = localStorage.getItem('activeBoard')
      if (storedActiveBoard) {
        setActiveBoard(JSON.parse(storedActiveBoard))
      }
    } catch (error) {
      localStorage.removeItem('boards')
      localStorage.removeItem('activeBoard')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (boardsData?.boards) {
      setIsLoading(true)
      setBoards(boardsData.boards)
      localStorage.setItem('boards', JSON.stringify(boardsData.boards))
      setIsLoading(false)
    }
  }, [boardsData])

  useEffect(() => {
    if (!activeBoardData?.board) {
      setActiveBoard(undefined)
      return
    }

    setIsLoading(true)
    const isBoardStillInList = boards?.some(
      (b) => b.id === activeBoardData.board.id,
    )

    if (isBoardStillInList) {
      setActiveBoard(activeBoardData.board)
      localStorage.setItem('activeBoard', JSON.stringify(activeBoardData.board))
    } else {
      setActiveBoard(undefined)
      localStorage.removeItem('activeBoard')
    }
    setIsLoading(false)
  }, [activeBoardData, boards])

  const handleEnableScrollFeature = (value: boolean) => {
    setEnableScrollFeature(value)
  }

  const handleSetIsLoading = (value: boolean) => {
    setIsLoading(value)
  }

  const handleChangeActiveBoard = async (board: BoardProps) => {
    setIsLoading(true)

    setActiveBoard(board)

    localStorage.setItem('activeBoard', JSON.stringify(board))

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
      }}
    >
      {children}
    </BoardsContext.Provider>
  )
}