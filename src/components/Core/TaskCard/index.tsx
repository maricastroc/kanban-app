import { TaskProps } from '@/@types/task'
import { TaskCardContainer } from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import { TaskDetailsModal } from '@/components/Modals/TaskDetailsModal'
import { useState } from 'react'

type TaskCardProps = {
  task: TaskProps
  provided: any
}

export function TaskCard({ task, provided }: TaskCardProps) {
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false)

  return (
    <Dialog.Root open={isTaskDetailsModalOpen}>
      <Dialog.Trigger asChild>
        <TaskCardContainer
          onClick={() => setIsTaskDetailsModalOpen(true)}
          className="task-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <strong>{task.title}</strong>
          <p>{`${task.subtasks.filter((subtask) => subtask.isCompleted).length} of ${task.subtasks.length} subtasks`}</p>
        </TaskCardContainer>
      </Dialog.Trigger>
      <TaskDetailsModal task={task} onClose={() => setIsTaskDetailsModalOpen(false)} />
    </Dialog.Root>
  )
}
