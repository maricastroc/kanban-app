import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { TaskProps } from '@/@types/task'

import { CheckedBox, Container, Title, UncheckedBox } from './styles'
import { useTaskContext } from '@/contexts/TasksContext'
import { SubtaskProps } from '@/@types/subtask'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'
import { KeyedMutator } from 'swr'
import { AxiosResponse } from 'axios'
import { BoardProps } from '@/@types/board'

interface SubtaskItemProps extends SubtaskProps {
  task: TaskProps
  handleSetIsLoading: (value: boolean) => void
  mutate: KeyedMutator<AxiosResponse<BoardProps, any>>
}

export function SubtaskItem({
  id,
  task,
  title,
  isCompleted,
  mutate,
  handleSetIsLoading
}: SubtaskItemProps) {
  const { toggleSubtaskStatus } = useTaskContext()

  const [isChecked, setIsChecked] = useState(isCompleted)

  const handleToggleSubtaskStatus = async () => {
    setIsChecked((prev) => !prev)

    try {
      handleSetIsLoading(true)

      const payload = {
        taskId: task.id,
        subtaskId: id
      }

      await api.put('/subtasks/status', payload)

      mutate()

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
      <Title className={isChecked ? 'checked' : 'unchecked'}>{title}</Title>
    </Container>
  )
}
