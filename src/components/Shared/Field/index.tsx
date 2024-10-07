import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Input, DeleteFieldBtn } from './styles'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import React, { forwardRef } from 'react'

interface FieldProps {
  hasError?: boolean
  isDisabled?: boolean
  placeholder?: string
  defaultValue?: string
  btnVariant?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: () => void
}

const Field = forwardRef<HTMLInputElement, FieldProps>(
  (
    {
      defaultValue,
      hasError = false,
      isDisabled = false,
      placeholder = '',
      btnVariant = '',
      onChange,
      onClick,
    },
    ref,
  ) => {
    return (
      <Container>
        <Input
          spellCheck={false}
          ref={ref}
          type="text"
          className={`${hasError ? 'error' : ''} ${
            isDisabled ? 'disabled' : ''
          }`}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onBlur={onChange}
        />
        <DeleteFieldBtn type="button" className={btnVariant} onClick={onClick}>
          <FontAwesomeIcon icon={faXmark} />
        </DeleteFieldBtn>
      </Container>
    )
  },
)

Field.displayName = 'Field'

export { Field }
