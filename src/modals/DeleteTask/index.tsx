import { TaskDTO } from '@/dtos/taskDTO'
import { Button } from '@/components/Button'

import { Description, ButtonsContainer } from './styles'
import { useTaskContext } from '@/contexts/TaskContext'
import { Content, Overlay, Title } from '../sharedStyles'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'

interface DeleteTaskProps {
  task: TaskDTO
  onClose: () => void
}

export function DeleteTask({ task, onClose }: DeleteTaskProps) {
  useEscapeKeyHandler(onClose)
  const { deleteTask } = useTaskContext()

  return (
    <>
      <Overlay onClick={() => onClose()} />
      <Content>
        <Title className="delete">Delete this task?</Title>
        <Description>
          <p>
            {`Are you sure you want to delete the ‘${task.title}’ task
          and its subtasks? This action cannot be reversed.`}
          </p>
        </Description>

        <ButtonsContainer>
          <Button
            title="Delete"
            variant="tertiary"
            onClick={() => {
              deleteTask(task)
              onClose()
            }}
          />
          <Button title="Cancel" variant="primary" onClick={() => onClose()} />
        </ButtonsContainer>
      </Content>
    </>
  )
}
