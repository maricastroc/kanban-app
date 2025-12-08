import { LabelHTMLAttributes, ReactNode } from 'react'
import { Label as StyledLabel } from './styles'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
}

export const Label = ({ children, ...rest }: LabelProps) => {
  return <StyledLabel {...rest}>{children}</StyledLabel>
}
