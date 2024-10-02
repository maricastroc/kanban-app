import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Input, DeleteFieldBtn } from './styles'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

interface FieldProps {
  hasError?: boolean
  isDisabled?: boolean
  placeholder?: string
  value: string
  btnVariant?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick: () => void
}

export function Field({
  value,
  hasError = false,
  isDisabled = false,
  placeholder = '',
  btnVariant = '',
  onChange,
  onClick,
}: FieldProps) {
  return (
    <Container>
      <Input
        type="text"
        className={`${hasError ? 'error' : ''} ${isDisabled ? 'disabled' : ''}`}
        placeholder={placeholder}
        defaultValue={value}
        onBlur={onChange}
      />
      <DeleteFieldBtn type="button" className={btnVariant} onClick={onClick}>
        <FontAwesomeIcon icon={faXmark} />
      </DeleteFieldBtn>
    </Container>
  )
}
