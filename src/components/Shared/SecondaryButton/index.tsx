import { ButtonHTMLAttributes } from 'react'
import { SecondaryBtn } from './styles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
}

export const SecondaryButton = ({ title, ...props }: ButtonProps) => {
  return (
    <SecondaryBtn {...props}>
      <p>{title}</p>
    </SecondaryBtn>
  )
}
