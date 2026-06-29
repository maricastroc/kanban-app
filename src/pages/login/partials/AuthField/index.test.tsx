import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { renderWithTheme } from '@/test/render'
import { AuthField } from './index'

describe('AuthField', () => {
  it('associates the label with the input and renders the placeholder', () => {
    renderWithTheme(
      <AuthField
        id="email"
        label="Email"
        icon={faEnvelope}
        placeholder="e.g. jondoe@gmail.com"
      />,
    )

    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('id', 'email')
    expect(input).toHaveAttribute('placeholder', 'e.g. jondoe@gmail.com')
  })

  it('is not marked invalid and shows no error by default', () => {
    renderWithTheme(<AuthField id="email" label="Email" icon={faEnvelope} />)

    expect(screen.getByLabelText('Email')).toHaveAttribute(
      'aria-invalid',
      'false',
    )
  })

  it('renders the error message and marks the input invalid when error is set', () => {
    renderWithTheme(
      <AuthField
        id="email"
        label="Email"
        icon={faEnvelope}
        error="Email is required."
      />,
    )

    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
  })

  it('forwards arbitrary input props to the underlying input', () => {
    renderWithTheme(
      <AuthField
        id="email"
        label="Email"
        icon={faEnvelope}
        defaultValue="hi@there.com"
      />,
    )

    expect(screen.getByLabelText('Email')).toHaveValue('hi@there.com')
  })
})
