import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { TaskProps } from '@/@types/task'

import { CheckedBox, Container, Title, UncheckedBox } from './styles'
import { useTaskContext } from '@/contexts/TasksContext'

interface SubtaskItemProps {
  id: number;
  task: TaskProps
  title: string
  isCompleted: boolean
}

export function SubtaskItem({ id, task, title, isCompleted }: SubtaskItemProps) {
  const { toggleSubtaskStatus } = useTaskContext()

  const [isChecked, setIsChecked] = useState(isCompleted)

  const handleToggleSubtaskStatus = () => {
    setIsChecked((prev) => !prev)
    toggleSubtaskStatus(task, id, !isChecked)
  }

  return (
    <Container>
      {isChecked ? (
        <CheckedBox onClick={() => handleToggleSubtaskStatus()}>
          <FontAwesomeIcon icon={faCheck} />
        </CheckedBox>
      ) : (
        <UncheckedBox onClick={() => handleToggleSubtaskStatus()} />
      )}
      <Title className={isChecked ? 'checked' : 'unchecked'}>{title}</Title>
    </Container>
  )
}
