import { Error } from './styles'

interface ErrorMessageProps {
  message?: string
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null

  return (
    <Error>
      <span>{message}</span>
    </Error>
  )
}

ErrorMessage.displayName = 'ErrorMessage'

export { ErrorMessage }
