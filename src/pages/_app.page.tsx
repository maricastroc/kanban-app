import { ThemeContext, ThemeProvider } from '@/contexts/ThemeContext'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { lightTheme } from '@/styles/themes/light'
import { darkTheme } from '@/styles/themes/dark'
import { GlobalStyle } from '@/styles/global'
import { BoardsContextProvider } from '@/contexts/BoardsContext'
import { Toaster } from 'react-hot-toast'
import { AppProps } from 'next/app'
import 'react-datepicker/dist/react-datepicker.css'

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
                <Toaster
                  toastOptions={{
                    style: {
                      backgroundColor: '#20212C',
                      color: '#fff',
                    },
                    success: {
                      style: {
                        backgroundColor: '#20212C',
                        color: '#fff',
                      },
                    },
                    error: {
                      style: {
                        backgroundColor: '#20212C',
                        color: '#fff',
                      },
                    },
                  }}
                />
                <main>
                  <Component {...pageProps} />
                </main>
                <GlobalStyle />
              </BoardsContextProvider>
            </StyledThemeProvider>
          )
        }}
      </ThemeContext.Consumer>
    </ThemeProvider>
  )
}

export default MyApp
