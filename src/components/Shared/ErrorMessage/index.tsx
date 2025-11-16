import { CSSProperties } from 'react'
import { Error } from './styles'

interface ErrorMessageProps {
  message?: string
  style?: CSSProperties
}

const ErrorMessage = ({ message, style }: ErrorMessageProps) => {
  if (!message) return null

  return (
    <Error style={style}>
      <span>{message}</span>
    </Error>
  )
}

ErrorMessage.displayName = 'ErrorMessage'

export { ErrorMessage }
