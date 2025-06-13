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
  const [isLoading, setIsLoading] = useState(false)
  const [enableScrollFeature, setEnableScrollFeature] = useState(false)
  const [boards, setBoards] = useState<BoardProps[] | null>(null)
  const [activeBoard, setActiveBoard] = useState<BoardProps | undefined>()

  function handleEnableScrollFeature(value: boolean) {
    setEnableScrollFeature(value)
  }

  function handleSetIsLoading(value: boolean) {
    setIsLoading(value)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedBoards = localStorage.getItem('boards')
    if (storedBoards) {
      try {
        setBoards(JSON.parse(storedBoards))
      } catch {
        localStorage.removeItem('boards')
      }
    }

    const storedActiveBoard = localStorage.getItem('activeBoard')
    if (storedActiveBoard) {
      try {
        setActiveBoard(JSON.parse(storedActiveBoard))
      } catch {
        localStorage.removeItem('activeBoard')
      }
    }
  }, [])

  const {
    data: boardsData,
    mutate: boardsMutate,
    isValidating: isValidatingBoards,
  } = useRequest<{ boards: BoardProps[] }>(
    {
      url: '/boards',
      method: 'GET',
    },
    {
      revalidateOnFocus: false,
    },
  )

  const {
    data: activeBoardData,
    mutate: activeBoardMutate,
    isValidating: isValidatingActiveBoard,
  } = useRequest<{ board: BoardProps }>(
    {
      url: '/boards/active',
      method: 'GET',
    },
    {
      revalidateOnFocus: false,
    },
  )

  useEffect(() => {
    if (boardsData?.boards) {
      setBoards(boardsData.boards)
      localStorage.setItem('boards', JSON.stringify(boardsData.boards))
    }
  }, [boardsData])

  useEffect(() => {
    if (activeBoardData?.board && !activeBoard) {
      setActiveBoard(activeBoardData.board)
      localStorage.setItem('activeBoard', JSON.stringify(activeBoardData.board))
    }
  }, [activeBoardData, activeBoard])

  const handleChangeActiveBoard = async (board: BoardProps) => {
    setActiveBoard(board)
    localStorage.setItem('activeBoard', JSON.stringify(board))

    await activeBoardMutate()
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
      }}
    >
      {children}
    </BoardsContext.Provider>
  )
}
