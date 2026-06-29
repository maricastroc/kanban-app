import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '@/test/render'
import { PasswordField } from './index'

describe('PasswordField', () => {
  it('renders a masked password input by default', () => {
    renderWithTheme(<PasswordField />)

    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password',
    )
  })

  it('toggles visibility when the show/hide button is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<PasswordField />)

    const input = screen.getByLabelText('Password')
    const showButton = screen.getByRole('button', { name: 'Show password' })

    expect(input).toHaveAttribute('type', 'password')
    expect(showButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(showButton)

    expect(input).toHaveAttribute('type', 'text')
    const hideButton = screen.getByRole('button', { name: 'Hide password' })
    expect(hideButton).toHaveAttribute('aria-pressed', 'true')

    await user.click(hideButton)
    expect(input).toHaveAttribute('type', 'password')
  })

  it('renders the error message and marks the input invalid', () => {
    renderWithTheme(<PasswordField error="Password is required." />)

    expect(screen.getByText('Password is required.')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
  })

  it('respects a custom label', () => {
    renderWithTheme(<PasswordField label="New password" />)

    expect(screen.getByLabelText('New password')).toBeInTheDocument()
  })
})
