import type { ReactNode } from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import { darkTheme } from '@/styles/themes/dark'
import Register from './index.page'

const { pushMock, postMock, toastSuccess } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  postMock: vi.fn(),
  toastSuccess: vi.fn(),
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
  const toast = { success: toastSuccess, error: vi.fn() }
  return { __esModule: true, default: toast, toast }
})

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({ enableDarkMode: true, toggleTheme: vi.fn() }),
}))

vi.mock('@/hooks/useAuthUser', () => ({
  useAuthUser: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    mutate: vi.fn(),
  }),
}))

const renderRegister = () =>
  render(
    <ThemeProvider theme={darkTheme}>
      <Register />
    </ThemeProvider>,
  )

async function fillForm(
  user: UserEvent,
  values: { name?: string; email?: string; password?: string },
) {
  if (values.name !== undefined) {
    await user.type(screen.getByLabelText('Name'), values.name)
  }
  if (values.email !== undefined) {
    await user.type(screen.getByLabelText('Email'), values.email)
  }
  if (values.password !== undefined) {
    await user.type(screen.getByLabelText('Password'), values.password)
  }
}

const valid = { name: 'Jon Doe', email: 'jon@doe.com', password: 'Abcdefg1' }

describe('Register page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the form once the auth check resolves', async () => {
    renderRegister()

    expect(
      await screen.findByRole('heading', { name: 'Create account' }),
    ).toBeInTheDocument()
  })

  it('rejects a password shorter than 8 characters', async () => {
    const user = userEvent.setup()
    renderRegister()

    await fillForm(user, { ...valid, password: 'Aa1' })
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(
      await screen.findByText('Password must have at least 8 characters.'),
    ).toBeInTheDocument()
    expect(postMock).not.toHaveBeenCalled()
  })

  it('requires an uppercase letter in the password', async () => {
    const user = userEvent.setup()
    renderRegister()

    await fillForm(user, { ...valid, password: 'abcdefg1' })
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(
      await screen.findByText(
        'Password must contain at least one uppercase letter.',
      ),
    ).toBeInTheDocument()
  })

  it('requires a lowercase letter in the password', async () => {
    const user = userEvent.setup()
    renderRegister()

    await fillForm(user, { ...valid, password: 'ABCDEFG1' })
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(
      await screen.findByText(
        'Password must contain at least one lowercase letter.',
      ),
    ).toBeInTheDocument()
  })

  it('requires a number in the password', async () => {
    const user = userEvent.setup()
    renderRegister()

    await fillForm(user, { ...valid, password: 'Abcdefgh' })
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(
      await screen.findByText('Password must contain at least one number.'),
    ).toBeInTheDocument()
  })

  it('requires a name of at least 3 characters', async () => {
    const user = userEvent.setup()
    renderRegister()

    await fillForm(user, { ...valid, name: 'Jo' })
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(
      await screen.findByText('Name must have at least 3 characters.'),
    ).toBeInTheDocument()
  })

  it('submits a valid form (with password_confirmation) and redirects to login', async () => {
    postMock.mockResolvedValueOnce({ data: { message: 'Account created!' } })
    const user = userEvent.setup()
    renderRegister()

    await fillForm(user, valid)
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith('/register', {
        name: 'Jon Doe',
        email: 'jon@doe.com',
        password: 'Abcdefg1',
        password_confirmation: 'Abcdefg1',
      })
    })

    expect(toastSuccess).toHaveBeenCalledWith('Account created!')
    expect(pushMock).toHaveBeenCalledWith('/login')
  })
})
