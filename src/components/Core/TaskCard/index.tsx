import { TaskProps } from '@/@types/task'
import { useDrag } from 'react-dnd'
import { TaskCardContainer } from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import { TaskDetailsModal } from '@/components/Modals/TaskDetailsModal'
import { useState } from 'react'

type TaskCardProps = {
  task: TaskProps
  column_index: number
}

export function TaskCard({ task, column_index }: TaskCardProps) {
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { ...task, column_index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <Dialog.Root open={isTaskDetailsModalOpen}>
      <Dialog.Trigger asChild>
        <TaskCardContainer
          onClick={() => setIsTaskDetailsModalOpen(true)}
          className="task-card"
          ref={drag}
          style={{ opacity: isDragging ? 0.5 : 1 }}
        >
          <strong>{task.title}</strong>
          <p>{`${
            task.subtasks.filter((subtask) => subtask.isCompleted).length
          } of ${task.subtasks.length} subtasks`}</p>
        </TaskCardContainer>
      </Dialog.Trigger>
      <TaskDetailsModal
        task={task}
        onClose={() => setIsTaskDetailsModalOpen(false)}
      />
    </Dialog.Root>
  )
}
