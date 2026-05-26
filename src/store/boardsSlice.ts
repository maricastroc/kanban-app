import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BoardProps } from '@/@types/board'
import { api } from '@/lib/axios'

interface BoardsState {
  boards: BoardProps[] | null
  activeBoard: BoardProps | undefined
  enableScrollFeature: boolean
  isValidatingBoards: boolean
  isValidatingActiveBoard: boolean
}

const initialState: BoardsState = {
  boards: null,
  activeBoard: undefined,
  enableScrollFeature: false,
  isValidatingBoards: false,
  isValidatingActiveBoard: false,
}

export const fetchBoards = createAsyncThunk('boards/fetchBoards', async () => {
  const response = await api.get<{ boards: BoardProps[] }>('/boards')
  return response.data.boards
})

export const fetchActiveBoard = createAsyncThunk(
  'boards/fetchActiveBoard',
  async () => {
    const response = await api.get<{ board: BoardProps }>('/boards/active')
    return response.data.board
  },
)

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setBoards(state, action: { payload: BoardProps[] | null }) {
      state.boards = action.payload
    },
    setActiveBoard(state, action: { payload: BoardProps | undefined }) {
      state.activeBoard = action.payload
    },
    setEnableScrollFeature(state, action: { payload: boolean }) {
      state.enableScrollFeature = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.isValidatingBoards = true
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.isValidatingBoards = false
        state.boards = action.payload ?? []
      })
      .addCase(fetchBoards.rejected, (state) => {
        state.isValidatingBoards = false
        state.boards = []
      })

      .addCase(fetchActiveBoard.pending, (state) => {
        state.isValidatingActiveBoard = true
      })
      .addCase(fetchActiveBoard.fulfilled, (state, action) => {
        state.isValidatingActiveBoard = false
        state.activeBoard = action.payload ?? undefined
      })
      .addCase(fetchActiveBoard.rejected, (state) => {
        state.isValidatingActiveBoard = false
        state.activeBoard = undefined
      })
  },
})

export const { setBoards, setActiveBoard, setEnableScrollFeature } =
  boardsSlice.actions
export default boardsSlice.reducer
