import { TextareaHTMLAttributes } from 'react'
import { TextArea as StyledTextArea } from './styles'

interface CustomTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
}

export function CustomTextarea({
  hasError = false,
  ...rest
}: CustomTextareaProps) {
  return <StyledTextArea className={hasError ? 'error' : ''} {...rest} />
}
