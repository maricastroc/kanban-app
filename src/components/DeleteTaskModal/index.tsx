import { TaskDTO } from '../../dtos/taskDTO'
import { Button } from '../Button'

import {
  Overlay,
  Description,
  Title,
  Content,
  ButtonsContainer,
} from './styles'

interface TaskDetailsModalProps {
  task: TaskDTO
  onClose: () => void
}

export function DeleteTaskModal({ task, onClose }: TaskDetailsModalProps) {
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
          <Button title="Delete" variant="tertiary" />
          <Button title="Cancel" variant="primary" onClick={() => onClose()} />
        </ButtonsContainer>
      </Content>
    </>
  )
}
