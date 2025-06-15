import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

import { Container, Title } from './styles'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { CheckedBox, UncheckedBox } from '@/styles/shared'

interface SubtaskItemProps {
  id: string | number
  name: string
  isCompleted: boolean
  handleSetIsLoading: (value: boolean) => void
}

export function SubtaskItem({
  id,
  name,
  isCompleted,
  handleSetIsLoading,
}: SubtaskItemProps) {
  const [isChecked, setIsChecked] = useState(isCompleted)

  const { activeBoardMutate } = useBoardsContext()

  const handleToggleSubtaskStatus = async () => {
    setIsChecked((prev) => !prev)

    try {
      handleSetIsLoading(true)

      await api.patch(`/subtasks/${id}/toggle-completion`)

      await activeBoardMutate()
    } catch (error) {
      handleApiError(error)
    } finally {
      handleSetIsLoading(false)
    }
  }

  return (
    <Container style={{ marginTop: '0.5rem' }}>
      {isChecked ? (
        <CheckedBox onClick={() => handleToggleSubtaskStatus()}>
          <FontAwesomeIcon icon={faCheck} />
        </CheckedBox>
      ) : (
        <UncheckedBox onClick={() => handleToggleSubtaskStatus()} />
      )}
      <Title className={isChecked ? 'checked' : 'unchecked'}>{name}</Title>
    </Container>
  )
}
