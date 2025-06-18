import React, { InputHTMLAttributes } from 'react'
import { Input as StyledInput } from './styles'

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
  isTransparent?: boolean
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ hasError = false, isTransparent = false, ...rest }, ref) => {
    return (
      <StyledInput
        ref={ref}
        className={`${hasError ? 'error' : ''} ${
          isTransparent ? 'transparent' : ''
        }`}
        {...rest}
      />
    )
  },
)

CustomInput.displayName = 'CustomInput'

export { CustomInput }
