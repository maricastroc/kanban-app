import { createSlice } from '@reduxjs/toolkit'

interface ThemeState {
  enableDarkMode: boolean
}

const initialState: ThemeState = {
  enableDarkMode: true,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.enableDarkMode = !state.enableDarkMode
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'theme',
          state.enableDarkMode ? 'DARK_THEME' : 'LIGHT_THEME',
        )
      }
    },
    setTheme(state, action: { payload: boolean }) {
      state.enableDarkMode = action.payload
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
