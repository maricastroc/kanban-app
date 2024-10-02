import { InputHTMLAttributes } from 'react'
import { Input as StyledInput } from './styles'

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

export function CustomInput({ hasError = false, ...rest }: CustomInputProps) {
  return <StyledInput className={hasError ? 'error' : ''} {...rest} />
}
