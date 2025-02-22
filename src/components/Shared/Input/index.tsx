import React, { InputHTMLAttributes } from 'react'
import { Input as StyledInput } from './styles'

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ hasError = false, ...rest }, ref) => {
    return (
      <StyledInput ref={ref} className={hasError ? 'error' : ''} {...rest} />
    )
  },
)

CustomInput.displayName = 'CustomInput'

export { CustomInput }
