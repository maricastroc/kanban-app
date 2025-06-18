import { ButtonHTMLAttributes } from 'react'
import { Container } from './styles'
import { ThreeDots } from 'react-loading-icons'

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
  return (
    <Container
      className={`${variant} ${isBigger ? 'bigger' : ''}`}
      disabled={disabled}
      {...props}
    >
      {disabled ? (
        <div style={{ display: 'flex', gap: 2 }}>
          <ThreeDots height={'8px'} className="animate-spin" />
        </div>
      ) : (
        <p>{title}</p>
      )}
    </Container>
  )
}

Button.displayName = 'Button'

export { Button }
