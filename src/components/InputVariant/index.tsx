import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Input, RemoveButton } from './styles'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

interface InputVariantProps {
  inputClassName: string
  placeholder?: string
  defaultValue: string
  btnClassName?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick: () => void
}

export function InputVariant({
  inputClassName,
  placeholder = '',
  defaultValue,
  btnClassName = '',
  onChange,
  onClick,
}: InputVariantProps) {
  return (
    <Container>
      <Input
        type="text"
        className={inputClassName}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
      />
      <RemoveButton type="button" className={btnClassName} onClick={onClick}>
        <FontAwesomeIcon icon={faXmark} />
      </RemoveButton>
    </Container>
  )
}
