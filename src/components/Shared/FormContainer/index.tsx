import { FormHTMLAttributes, ReactNode } from 'react'
import { FormContainer as CustomFormContainer } from './styles'

interface FormContainerProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
}

const FormContainer = ({ children, ...rest }: FormContainerProps) => {
  return <CustomFormContainer {...rest}>{children}</CustomFormContainer>
}

FormContainer.displayName = 'FormContainer'

export { FormContainer }
