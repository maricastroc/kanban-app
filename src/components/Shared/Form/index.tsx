import { FormHTMLAttributes, ReactNode } from 'react';
import { FormContainer as CustomFormContainer } from './styles'

interface FormContainerProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export function FormContainer({ children, ...rest }: FormContainerProps) {
  return (
    <CustomFormContainer {...rest}>
      {children}
    </CustomFormContainer>
  )
}