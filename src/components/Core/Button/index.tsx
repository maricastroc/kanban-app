import { ButtonHTMLAttributes } from 'react'
import { Container } from './styles'
import { ThreeDots } from 'react-loading-icons'
import { useTheme } from 'styled-components'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string
  title: string
  isBigger?: boolean
}

const Button = ({
  variant = 'primary',
  title,
  isBigger = false,
  disabled,
  ...props
}: ButtonProps) => {
  const theme = useTheme()

  let loaderColor = theme['button-title']

  if (variant === 'secondary') {
    loaderColor = theme['primary-color']
  }

  return (
    <Container
      className={`${variant} ${isBigger ? 'bigger' : ''}`}
      disabled={disabled}
      {...props}
    >
      {disabled ? (
        <div style={{ display: 'flex', gap: 2 }}>
          <ThreeDots
            height={'8px'}
            fill={loaderColor}
            className="animate-spin"
          />
        </div>
      ) : (
        <p>{title}</p>
      )}
    </Container>
  )
}

Button.displayName = 'Button'

export { Button }
