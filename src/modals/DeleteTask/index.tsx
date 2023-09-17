import { useContext } from 'react'
import { TaskDTO } from '@/dtos/taskDTO'
import { Button } from '@/components/Button'

import {
  Overlay,
  Description,
  Title,
  Content,
  ButtonsContainer,
} from './styles'
import { BoardsContext } from '@/contexts/BoardsContext'

interface DeleteTaskProps {
  task: TaskDTO
  onClose: () => void
}

export function DeleteTask({ task, onClose }: DeleteTaskProps) {
  const { deleteTask } = useContext(BoardsContext)

  return (
    <>
      <Overlay onClick={() => onClose()} />
      <Content>
        <Title>
          <h3>Delete this board?</h3>
        </Title>
        <Description className="DialogDescription">
          <p>
            {`Are you sure you want to delete the ‘${task.title}’ board? task
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
