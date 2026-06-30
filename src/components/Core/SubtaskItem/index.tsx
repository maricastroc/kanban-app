import { CSSProperties, ReactNode, Ref, useState } from 'react'
import { Container, Title } from './styles'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { CheckInput } from '@/components/Core/CheckInput'

interface SubtaskItemProps {
  id: string | number
  name: string
  isCompleted: boolean
  handleSetIsLoading: (value: boolean) => void
  /** Optional drag handle rendered at the start of the row (sortable lists). */
  dragHandle?: ReactNode
  /** Ref for the sortable node — applied to the row container. */
  containerRef?: Ref<HTMLDivElement>
  style?: CSSProperties
}

export function SubtaskItem({
  id,
  name,
  isCompleted,
  handleSetIsLoading,
  dragHandle,
  containerRef,
  style,
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
    <Container ref={containerRef} style={style}>
      {dragHandle}
      <CheckInput
        isChecked={isChecked}
        onClick={() => handleToggleSubtaskStatus()}
      />
      <Title className={isChecked ? 'checked' : 'unchecked'}>{name}</Title>
    </Container>
  )
}
