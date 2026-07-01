import { LabelHTMLAttributes, ReactNode } from 'react'
import { Label as StyledLabel } from './styles'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
  hasError?: boolean
}

export const Label = ({ children, hasError, ...rest }: LabelProps) => {
  return <StyledLabel $hasError={hasError} {...rest}>{children}</StyledLabel>
}
