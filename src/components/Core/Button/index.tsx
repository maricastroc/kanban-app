import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Container } from './styles'
import { ThreeDots } from 'react-loading-icons'
import { useTheme } from 'styled-components'

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
  const theme = useTheme()

  const resolvedSize: Size = size ?? (isBigger ? 'lg' : 'md')

  let loaderColor = theme['accent-on']
  if (variant === 'secondary') loaderColor = theme['text-color']
  if (variant === 'danger' || variant === 'tertiary') loaderColor = '#ffffff'

  return (
    <Container
      className={`${variant} ${resolvedSize} ${fullWidth ? 'full' : ''}`}
      aria-disabled={isLoading || disabled}
      aria-busy={isLoading}
      {...props}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <ThreeDots height="8px" fill={loaderColor} aria-hidden="true" />
      ) : (
        children ?? <p>{title}</p>
      )}
    </Container>
  )
}
