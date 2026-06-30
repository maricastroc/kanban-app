import { ButtonHTMLAttributes, ReactNode } from 'react'
import { ButtonSpinner, Container } from './styles'

type Variant = 'primary' | 'secondary' | 'danger' | 'tertiary'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  title?: string
  children?: ReactNode
  isBigger?: boolean
  isLoading?: boolean
  fullWidth?: boolean
}

export const Button = ({
  variant = 'primary',
  size,
  title,
  children,
  isBigger = false,
  isLoading = false,
  fullWidth = true,
  disabled,
  ...props
}: ButtonProps) => {
  const resolvedSize: Size = size ?? (isBigger ? 'lg' : 'md')

  return (
    <Container
      className={`${variant} ${resolvedSize} ${fullWidth ? 'full' : ''}`}
      aria-disabled={isLoading || disabled}
      aria-busy={isLoading}
      {...props}
      disabled={isLoading || disabled}
    >
      {isLoading && <ButtonSpinner aria-hidden="true" />}
      {children ?? <p>{title}</p>}
    </Container>
  )
}
