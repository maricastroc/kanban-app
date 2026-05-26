import { configureStore } from '@reduxjs/toolkit'
import boardsReducer from './boardsSlice'
import themeReducer from './themeSlice'

export const store = configureStore({
  reducer: {
    boards: boardsReducer,
    theme: themeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
