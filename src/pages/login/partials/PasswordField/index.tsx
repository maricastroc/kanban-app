import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons'
import {
  FormField,
  IconWrapper,
  InputContainer,
  InputField,
  PasswordIconWrapper,
} from '../../styles'
import { Label } from '@/components/Core/Label'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export const PasswordField = forwardRef<HTMLInputElement, Props>(
  ({ error, label = 'Password', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <FormField>
        <Label htmlFor="password" hasError={!!error}>
          {label}
        </Label>
        <InputContainer>
          <IconWrapper aria-hidden="true">
            <FontAwesomeIcon icon={faLock} style={{ fontSize: 16 }} />
          </IconWrapper>
          <InputField
            id="password"
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className={error ? 'error' : ''}
            aria-invalid={!!error}
            {...props}
          />
          <PasswordIconWrapper
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              style={{ fontSize: 16 }}
              aria-hidden="true"
            />
          </PasswordIconWrapper>
        </InputContainer>
        {error && <ErrorMessage message={error} />}
      </FormField>
    )
  },
)

PasswordField.displayName = 'PasswordField'
