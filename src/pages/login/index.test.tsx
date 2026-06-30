import type { ReactNode } from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import { darkTheme } from '@/styles/themes/dark'
import Login from './index.page'

// Shared spies, created via vi.hoisted so the (hoisted) vi.mock factories below
// can reference them.
const { pushMock, postMock, toastSuccess, toastError, revalidateAuthMock } =
  vi.hoisted(() => ({
    pushMock: vi.fn(),
    postMock: vi.fn(),
    toastSuccess: vi.fn(),
    toastError: vi.fn(),
    revalidateAuthMock: vi.fn(),
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

// Auth now lives in an httpOnly cookie; the session is resolved through
// useAuthUser, so we stub it to control the auth state in the tests.
vi.mock('@/hooks/useAuthUser', () => ({
  useAuthUser: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    mutate: revalidateAuthMock,
  }),
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

  it('submits credentials, refreshes the session, notifies and navigates on success', async () => {
    postMock.mockResolvedValueOnce({ data: { user: { id: 1 } } })
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

    // session is established via the cookie; the app refreshes /user instead of
    // reading a token from localStorage
    expect(revalidateAuthMock).toHaveBeenCalled()
    expect(toastSuccess).toHaveBeenCalledWith('Welcome to Cadence!')
    expect(pushMock).toHaveBeenCalledWith('/')
  })

  it('enters the demo workspace, refreshes the session, notifies and navigates', async () => {
    postMock.mockResolvedValueOnce({ data: {} })
    const user = userEvent.setup()
    renderLogin()

    await user.click(
      await screen.findByRole('button', { name: /explore the demo/i }),
    )

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith('demo-login')
    })

    expect(revalidateAuthMock).toHaveBeenCalled()
    expect(toastSuccess).toHaveBeenCalledWith(
      'Welcome! Explore the demo workspace.',
    )
    expect(pushMock).toHaveBeenCalledWith('/')
  })

  it('does not navigate when the request fails', async () => {
    postMock.mockRejectedValueOnce(new Error('invalid credentials'))
    const user = userEvent.setup()
    renderLogin()

    await user.type(await screen.findByLabelText('Email'), 'jon@doe.com')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => expect(postMock).toHaveBeenCalled())

    expect(pushMock).not.toHaveBeenCalled()
    expect(toastSuccess).not.toHaveBeenCalled()
  })
})
