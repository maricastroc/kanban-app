import { ReactNode } from 'react'
import { FieldsContainer as CustomFieldsContainer } from './styles'

interface FieldsContainerProps {
  children: ReactNode
}

export function FieldsContainer({ children }: FieldsContainerProps) {
  return <CustomFieldsContainer>{children}</CustomFieldsContainer>
}
