import { ButtonHTMLAttributes } from 'react'
import { Container } from './styles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string
  title: string
  isBigger?: boolean
}

const Button = ({
  variant = 'primary',
  title,
  isBigger = false,
  ...props
}: ButtonProps) => {
  return (
    <Container className={`${variant} ${isBigger ? 'bigger' : ''}`} {...props}>
      <p>{title}</p>
    </Container>
  )
}

Button.displayName = 'Button'

export { Button }
