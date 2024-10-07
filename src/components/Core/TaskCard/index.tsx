import { TaskProps } from '@/@types/task'
import { useDrag } from 'react-dnd'
import { TaskCardContainer } from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import { ViewTaskModal } from '@/components/Modals/ViewTaskModal'
import { useState } from 'react'

type TaskCardProps = {
  task: TaskProps
  column_index: number
}

export function TaskCard({ task, column_index }: TaskCardProps) {
  const [isViewTaskModalOpen, setIsViewTaskModalOpen] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { ...task, column_index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <Dialog.Root open={isViewTaskModalOpen}>
      <Dialog.Trigger asChild>
        <TaskCardContainer
          onClick={() => setIsViewTaskModalOpen(true)}
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
      <ViewTaskModal task={task} onClose={() => setIsViewTaskModalOpen(false)} />
    </Dialog.Root>
  )
}
