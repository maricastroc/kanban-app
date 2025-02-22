/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { TaskProps } from '@/@types/task'
import { TaskCardContainer } from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import { TaskDetailsModal } from '@/components/Modals/TaskDetailsModal'
import { useEffect, useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'

type TaskCardProps = {
  task: TaskProps
  provided: any
}

export function TaskCard({ task, provided }: TaskCardProps) {
  const { handleEnableScrollFeature } = useBoardsContext()

  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false)

  useEffect(() => {
    handleEnableScrollFeature(!isTaskDetailsModalOpen)
  }, [isTaskDetailsModalOpen])

  return (
    <Dialog.Root open={isTaskDetailsModalOpen}>
      <Dialog.Trigger asChild>
        <TaskCardContainer
          onClick={() => setIsTaskDetailsModalOpen(true)}
          className="task-card"
          ref={isTaskDetailsModalOpen ? null : provided.innerRef}
          {...(isTaskDetailsModalOpen ? {} : provided.draggableProps)}
          {...(isTaskDetailsModalOpen ? {} : provided.dragHandleProps)}
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
