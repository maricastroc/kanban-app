import {
  Container,
  EmptyTasksContainer,
  TagContainer,
  TaskItem,
  TasksContainer,
} from './styles'

import { useState } from 'react'
import { ViewTask } from '@/modals/ViewTask'
import { TaskDTO } from '@/dtos/taskDTO'
import { SubtaskDTO } from '@/dtos/subtaskDTO'
import { ColumnDTO } from '@/dtos/columnDTO'

type ColumnProps = ColumnDTO & {
  index: number
}

export function Column({ name, tasks, index }: ColumnProps) {
  const variant = `${index + 1}` as '1' | '2' | '3' | '4' | '5' | '6'

  const [openViewTask, setOpenViewTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskDTO | null>(null)

  const handleOpenTaskDetails = (task: TaskDTO) => {
    setSelectedTask(task)
    setOpenViewTask(true)
  }

  const handleCloseTaskDetails = () => {
    setOpenViewTask(false)
  }

  return (
    <Container>
      {openViewTask && selectedTask && (
        <ViewTask task={selectedTask} onClose={handleCloseTaskDetails} />
      )}
      <TagContainer variant={variant}>
        <span />
        <strong>{`${name} (${tasks.length})`}</strong>
      </TagContainer>

      {tasks.length > 0 ? (
        <TasksContainer>
          {tasks.map((task: TaskDTO) => {
            const completedSubtasks = task.subtasks.filter(
              (subtask: SubtaskDTO) => subtask.isCompleted,
            )
            return (
              <TaskItem
                key={task.title}
                onClick={() => handleOpenTaskDetails(task)}
              >
                <strong>{task.title}</strong>
                <p>{`${completedSubtasks.length} of ${task.subtasks.length} subtasks`}</p>
              </TaskItem>
            )
          })}
        </TasksContainer>
      ) : (
        <EmptyTasksContainer />
      )}
    </Container>
  )
}
