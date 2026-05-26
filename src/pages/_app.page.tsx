import '@/utils/wdyr'
import { Provider } from 'react-redux'
import { store } from '@/store/index'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { lightTheme } from '@/styles/themes/light'
import { darkTheme } from '@/styles/themes/dark'
import { GlobalStyle } from '@/styles/global'
import { Toaster } from 'react-hot-toast'
import { AppProps } from 'next/app'
import { useAppSelector } from '@/store/hooks'
import 'react-datepicker/dist/react-datepicker.css'

function ThemedApp({ Component, pageProps }: AppProps) {
  const enableDarkMode = useAppSelector((state) => state.theme.enableDarkMode)

  return (
    <StyledThemeProvider theme={enableDarkMode ? darkTheme : lightTheme}>
      <Toaster
        toastOptions={{
          style: { backgroundColor: '#20212C', color: '#fff' },
          success: { style: { backgroundColor: '#20212C', color: '#fff' } },
          error: { style: { backgroundColor: '#20212C', color: '#fff' } },
        }}
      />
      <main>
        <Component {...pageProps} />
      </main>
      <GlobalStyle />
    </StyledThemeProvider>
  )
}

function MyApp(props: AppProps) {
  return (
    <Provider store={store}>
      <ThemedApp {...props} />
    </Provider>
  )
}

export default MyApp
