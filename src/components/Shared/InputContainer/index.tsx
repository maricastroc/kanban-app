import { ReactNode } from 'react';
import { InputContainer as CustomInputContainer } from './styles'

interface InputContainerProps {
  children: ReactNode;
}

export function InputContainer({ children }: InputContainerProps) {
  return (
    <CustomInputContainer>
      {children}
    </CustomInputContainer>
  )
}