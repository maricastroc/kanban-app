import { ReactNode } from 'react'
import { InputContainer as CustomInputContainer } from './styles'

interface InputContainerProps {
  children: ReactNode
}

const InputContainer = ({ children }: InputContainerProps) => {
  return (
    <CustomInputContainer spellCheck={false}>{children}</CustomInputContainer>
  )
}

InputContainer.displayName = 'InputContainer'

export { InputContainer }
