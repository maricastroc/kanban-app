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
                      backgroundColor: enableDarkMode ? '#16161B' : '#FFFFFF',
                      color: enableDarkMode ? '#E7E7EA' : '#15161A',
                      border: enableDarkMode
                        ? '1px solid rgba(255,255,255,0.10)'
                        : '1px solid rgba(0,0,0,0.10)',
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
