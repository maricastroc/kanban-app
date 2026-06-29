import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { darkTheme } from '@/styles/themes/dark'

/**
 * Renders a component wrapped in the styled-components ThemeProvider (dark theme,
 * the app default) so styled components can resolve theme tokens during tests.
 */
export function renderWithTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
    ),
    ...options,
  })
}
