import type { ReactNode } from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import { darkTheme } from '@/styles/themes/dark'
import Login from './index.page'

// Shared spies, created via vi.hoisted so the (hoisted) vi.mock factories below
// can reference them.
const { pushMock, postMock, toastSuccess, toastError } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  postMock: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}))

vi.mock('next/router', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    prefetch: vi.fn(),
    events: { on: vi.fn(), off: vi.fn() },
  }),
}))

vi.mock('next/image', () => ({ default: () => null }))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('next-seo', () => ({ NextSeo: () => null }))

vi.mock('@/lib/axios', () => ({ api: { post: postMock } }))

vi.mock('react-hot-toast', () => {
  const toast = { success: toastSuccess, error: toastError }
  return { __esModule: true, default: toast, toast }
})

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({ enableDarkMode: true, toggleTheme: vi.fn() }),
}))

const renderLogin = () =>
  render(
    <ThemeProvider theme={darkTheme}>
      <Login />
    </ThemeProvider>,
  )

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders the login form once the auth check resolves', async () => {
    renderLogin()

    expect(
      await screen.findByRole('heading', { name: 'Login' }),
    ).toBeInTheDocument()
  })

  it('shows validation errors and does not call the API on an empty submit', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(await screen.findByRole('button', { name: /login/i }))

    expect(await screen.findByText('E-mail is required.')).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()
    expect(postMock).not.toHaveBeenCalled()
  })

  it('submits credentials, stores the token, notifies and navigates on success', async () => {
    postMock.mockResolvedValueOnce({ data: { token: 'jwt-123' } })
    const user = userEvent.setup()
    renderLogin()

    await user.type(await screen.findByLabelText('Email'), 'jon@doe.com')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith('login', {
        email: 'jon@doe.com',
        password: 'secret123',
        redirect: false,
      })
    })

    expect(localStorage.getItem('auth_token')).toBe('jwt-123')
    expect(toastSuccess).toHaveBeenCalledWith('Welcome to Kanban App!')
    expect(pushMock).toHaveBeenCalledWith('/')
  })

  it('shows an error and does not navigate when no token is returned', async () => {
    postMock.mockResolvedValueOnce({ data: {} })
    const user = userEvent.setup()
    renderLogin()

    await user.type(await screen.findByLabelText('Email'), 'jon@doe.com')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith('No token returned.'),
    )
    expect(pushMock).not.toHaveBeenCalled()
  })
})
