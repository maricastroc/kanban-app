import { ThemeContext, ThemeProvider } from '@/contexts/ThemeContext'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { lightTheme } from '@/styles/themes/light'
import { darkTheme } from '@/styles/themes/dark'
import { GlobalStyle } from '@/styles/global'
import { BoardsContextProvider } from '@/contexts/BoardsContext'
import { TaskContextProvider } from '@/contexts/TasksContext'
import { Toaster } from 'react-hot-toast'
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {(context) => {
          if (!context) {
            return null
          }

          const { enableDarkMode } = context

          return (
            <StyledThemeProvider
              theme={enableDarkMode ? darkTheme : lightTheme}
            >
              <BoardsContextProvider>
                <TaskContextProvider>
                  <Toaster />
                  <Component {...pageProps} />
                  <GlobalStyle />
                </TaskContextProvider>
              </BoardsContextProvider>
            </StyledThemeProvider>
          )
        }}
      </ThemeContext.Consumer>
    </ThemeProvider>
  )
}

export default MyApp
