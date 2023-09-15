import * as Dialog from '@radix-ui/react-dialog'
import { TaskDetailsModal } from '../TaskDetailsModal'
import { ColumnDTO } from '../../dtos/columnDTO'

import { Container, TagContainer, TaskItem, TasksContainer } from './styles'
import { theme } from '../../styles/index'

type ColumnProps = ColumnDTO & {
  index: number
}

export function Column({ name, tasks, index }: ColumnProps) {
  const colorKey = `tagColor${index + 1}` as keyof typeof theme.colors

  return (
    <Container>
      <TagContainer>
        <span style={{ backgroundColor: theme.colors[colorKey].toString() }} />
        <strong>{`${name} (${tasks.length})`}</strong>
      </TagContainer>

      <TasksContainer>
        {tasks.map((task) => {
          const completedSubtasks = task.subtasks.filter(
            (subtask) => subtask.isCompleted,
          )
          return (
            <Dialog.Root key={task.title}>
              <Dialog.Trigger asChild>
                <TaskItem>
                  <strong>{task.title}</strong>
                  <p>{`${completedSubtasks.length} of ${task.subtasks.length} subtasks`}</p>
                </TaskItem>
              </Dialog.Trigger>
              <TaskDetailsModal task={task} />
            </Dialog.Root>
          )
        })}
      </TasksContainer>
    </Container>
  )
}
