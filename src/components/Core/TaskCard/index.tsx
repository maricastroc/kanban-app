/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { TaskProps } from '@/@types/task'
import { TaskCardContainer } from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import { TaskDetailsModal } from '@/components/Modals/TaskDetailsModal'
import { useEffect, useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { AxiosResponse } from 'axios'
import { BoardProps } from '@/@types/board'
import { KeyedMutator } from 'swr'
import { BoardColumnProps } from '@/@types/board-column'

type TaskCardProps = {
  task: TaskProps
  column: BoardColumnProps
  mutate: KeyedMutator<AxiosResponse<BoardProps, any>>
  provided: any
  activeBoard: BoardProps
  boardId: string
}

export function TaskCard({ task, provided, activeBoard, column, boardId, mutate }: TaskCardProps) {
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
            task?.subtasks?.filter((subtask) => subtask?.isCompleted)?.length
          } of ${task.subtasks.length} subtasks`}</p>
        </TaskCardContainer>
      </Dialog.Trigger>
      <TaskDetailsModal
        task={task}
        column={column}
        activeBoard={activeBoard}
        boardId={boardId}
        mutate={mutate}
        onClose={() => setIsTaskDetailsModalOpen(false)}
      />
    </Dialog.Root>
  )
}
