/* eslint-disable @typescript-eslint/no-explicit-any */
import { BoardProps } from '@/@types/board'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
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
  handleChangeBoardStatus: (value: BoardProps) => Promise<void>

  activeBoard: BoardProps | undefined
  boards: BoardProps[] | undefined

  mutate: KeyedMutator<AxiosResponse<BoardProps, any>>
  boardsMutate: KeyedMutator<AxiosResponse<BoardProps[], any>>
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

  const [activeBoard, setActiveBoard] = useState<BoardProps | undefined>()

  function handleEnableScrollFeature(value: boolean) {
    setEnableScrollFeature(value)
  }

  function handleSetIsLoading(value: boolean) {
    setIsLoading(value)
  }

  const { data: activeBoardData, mutate } = useRequest<BoardProps>({
    url: '/board/get',
    method: 'GET',
  })

  const { data: boards, mutate: boardsMutate } = useRequest<BoardProps[]>({
    url: '/boards',
    method: 'GET',
  })

  const handleChangeBoardStatus = async (board: BoardProps) => {
    try {
      setIsLoading(true)

      const payload = {
        boardId: board.id,
      }

      await api.put('/board/status', payload)

      mutate()
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (activeBoardData) {
      setActiveBoard(activeBoardData)
    }
  }, [activeBoardData])

  useEffect(() => {
    if (!boards?.length) {
      setActiveBoard(undefined)
    }
  }, [boards])

  return (
    <BoardsContext.Provider
      value={{
        enableScrollFeature,
        handleEnableScrollFeature,
        isLoading,
        handleSetIsLoading,
        handleChangeBoardStatus,
        activeBoard,
        boards,
        mutate,
        boardsMutate,
      }}
    >
      {children}
    </BoardsContext.Provider>
  )
}
