import { CSSProperties } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { Error } from './styles'

interface ErrorMessageProps {
  message?: string
  style?: CSSProperties
}

const ErrorMessage = ({ message, style }: ErrorMessageProps) => {
  if (!message) return null

  return (
    <Error style={style}>
      <FontAwesomeIcon icon={faCircleExclamation} aria-hidden />
      <span>{message}</span>
    </Error>
  )
}

ErrorMessage.displayName = 'ErrorMessage'

export { ErrorMessage }
