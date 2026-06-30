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
                    success: {
                      iconTheme: {
                        primary: enableDarkMode
                          ? darkTheme['primary-color']
                          : lightTheme['primary-color'],
                        secondary: enableDarkMode
                          ? darkTheme['card-color']
                          : lightTheme['card-color'],
                      },
                    },
                    style: {
                      backgroundColor: enableDarkMode
                        ? darkTheme['card-color']
                        : lightTheme['card-color'],
                      color: enableDarkMode
                        ? darkTheme['text-color']
                        : lightTheme['title-color'],
                      border: `1px solid ${
                        enableDarkMode
                          ? darkTheme['hairline-strong']
                          : lightTheme['hairline-strong']
                      }`,
                      boxShadow: enableDarkMode
                        ? darkTheme['shadow-md']
                        : lightTheme['shadow-md'],
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
