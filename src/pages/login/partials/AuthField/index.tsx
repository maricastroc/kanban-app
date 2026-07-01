import { InputHTMLAttributes, forwardRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  FormField,
  IconWrapper,
  InputContainer,
  InputField,
} from '../../styles'
import { Label } from '@/components/Core/Label'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  icon: IconDefinition
  error?: string
}

export const AuthField = forwardRef<HTMLInputElement, Props>(
  ({ id, label, icon, error, ...props }, ref) => (
    <FormField>
      <Label htmlFor={id} hasError={!!error}>
        {label}
      </Label>
      <InputContainer>
        <IconWrapper aria-hidden="true">
          <FontAwesomeIcon icon={icon} style={{ fontSize: 16 }} />
        </IconWrapper>
        <InputField
          id={id}
          ref={ref}
          className={error ? 'error' : ''}
          aria-invalid={!!error}
          {...props}
        />
      </InputContainer>
      {error && <ErrorMessage message={error} />}
    </FormField>
  ),
)

AuthField.displayName = 'AuthField'
