import { LabelHTMLAttributes, ReactNode } from 'react'
import { Label as StyledLabel } from './styles'

interface CustomLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
}

const CustomLabel = ({ children, ...rest }: CustomLabelProps) => {
  return <StyledLabel {...rest}>{children}</StyledLabel>
}

CustomLabel.displayName = 'CustomLabel'

export { CustomLabel }
