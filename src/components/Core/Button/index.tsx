import { ButtonHTMLAttributes } from 'react'
import { Container } from './styles'
import { ThreeDots } from 'react-loading-icons'
import { useTheme } from 'styled-components'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string
  title: string
  isBigger?: boolean
  isLoading?: boolean
}

export const Button = ({
  variant = 'primary',
  title,
  isBigger = false,
  isLoading = false,
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
      aria-disabled={isLoading}
      aria-busy={isLoading}
      {...props}
      disabled={false}
    >
      {isLoading ? (
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ThreeDots
            height={'8px'}
            fill={loaderColor}
            aria-hidden="true"
            className="animate-spin"
          />
          <span
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              border: 0,
            }}
          >
            Loading…
          </span>
        </div>
      ) : (
        <p>{title}</p>
      )}
    </Container>
  )
}
