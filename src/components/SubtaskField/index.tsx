import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Input, DeleteSubtaskBtn } from './styles'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

interface SubtaskFieldProps {
  hasError: boolean;
  placeholder?: string
  value: string
  btnVariant?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick: () => void
}

export function SubtaskField({
  hasError,
  placeholder = '',
  value,
  btnVariant = '',
  onChange,
  onClick,
}: SubtaskFieldProps) {
  return (
    <Container>
      <Input
        type="text"
        className={hasError ? 'error' : ''}
        placeholder={placeholder}
        defaultValue={value}
        onBlur={onChange}
      />
      <DeleteSubtaskBtn type="button" className={btnVariant} onClick={onClick}>
        <FontAwesomeIcon icon={faXmark} />
      </DeleteSubtaskBtn>
    </Container>
  )
}
