import { ButtonHTMLAttributes } from 'react'
import { Container } from './styles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string
  title: string
}

export function Button({ variant = 'primary', title, ...props }: ButtonProps) {
  return (
    <Container className={variant} {...props}>
      <p>{title}</p>
    </Container>
  )
}
