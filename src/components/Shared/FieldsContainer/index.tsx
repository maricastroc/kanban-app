import { ReactNode } from 'react'
import { FieldsContainer as CustomFieldsContainer } from './styles'

interface FieldsContainerProps {
  children: ReactNode
}

const FieldsContainer = ({ children }: FieldsContainerProps) => {
  return <CustomFieldsContainer>{children}</CustomFieldsContainer>
}

FieldsContainer.displayName = 'FieldsContainer'

export { FieldsContainer }
