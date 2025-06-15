/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TaskProps } from '@/@types/task'
import {
  InfoContent,
  InfoItem,
  Tag,
  TagsContainer,
  TaskCardContainer,
} from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import { TaskDetailsModal } from '@/components/Modals/TaskDetailsModal'
import { useEffect, useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { BoardColumnProps } from '@/@types/board-column'
import { formatDate } from '@/utils/formatDate'
import { faClock, faList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getDueStatus } from '@/utils/getDueStatus'
import { tagColors } from '@/components/Shared/SelectInput'

type TaskCardProps = {
  task: TaskProps
  column: BoardColumnProps
  provided: any
}

export function TaskCard({ task, provided, column }: TaskCardProps) {
  const { handleEnableScrollFeature } = useBoardsContext()

  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false)
  console.log(task?.due_date)
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
          {task?.tags && task?.tags?.length > 0 && (
            <TagsContainer>
              {task.tags.map((item) => {
                const tagColor = tagColors.find(
                  (tag) => tag.name === item.tag.color,
                )?.color
                return (
                  <Tag key={item.id} style={{ backgroundColor: tagColor }} />
                )
              })}
            </TagsContainer>
          )}
          <strong>{task.name}</strong>

          <InfoContent>
            <InfoItem>
              <FontAwesomeIcon icon={faList} />
              <p>{`${
                task?.subtasks?.filter((subtask) => subtask?.is_completed)
                  ?.length
              } of ${task?.subtasks?.length}`}</p>
            </InfoItem>

            {task?.due_date && (
              <InfoItem
                className={`${getDueStatus(task.due_date, task.subtasks)}`}
              >
                <FontAwesomeIcon icon={faClock} />
                <p>{formatDate(task.due_date)}</p>
              </InfoItem>
            )}
          </InfoContent>
        </TaskCardContainer>
      </Dialog.Trigger>
      <TaskDetailsModal
        task={task}
        column={column}
        onClose={() => setIsTaskDetailsModalOpen(false)}
      />
    </Dialog.Root>
  )
}
