/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {
  InfoContent,
  InfoItem,
  ProgressContainer,
  ProgressFill,
  ProgressWrapper,
  Tag,
  TagsContainer,
  TaskCardContainer,
} from './styles'
import { TaskDetailsModal } from '@/components/Modals/TaskDetailsModal'
import { getTagHex } from '@/utils/getTagHex'
import { TaskProps } from '@/@types/task'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { BoardColumnProps } from '@/@types/board-column'
import { formatDate } from '@/utils/formatDate'
import { getDueStatus } from '@/utils/getDueStatus'
import { faClock, faListCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type TaskCardProps = {
  task: TaskProps
  column: BoardColumnProps
  provided: any
  isDragging?: boolean
}

export function TaskCard({
  task,
  provided,
  column,
  isDragging,
}: TaskCardProps) {
  const { handleEnableScrollFeature } = useBoardsContext()

  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false)

  useEffect(() => {
    handleEnableScrollFeature(!isTaskDetailsModalOpen)
  }, [isTaskDetailsModalOpen])

  const totalSubtasks = task?.subtasks?.length || 0
  const completedSubtasks =
    task?.subtasks?.filter((subtask) => subtask?.is_completed)?.length || 0
  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

  // Drag affordance: append a slight tilt to the lib's translate transform
  const dragProps = isTaskDetailsModalOpen ? {} : provided.draggableProps
  const dragHandle = isTaskDetailsModalOpen ? {} : provided.dragHandleProps
  const baseStyle = dragProps?.style
  const dragStyle =
    isDragging && baseStyle?.transform
      ? { ...baseStyle, transform: `${baseStyle.transform} rotate(2deg)` }
      : baseStyle

  return (
    <Dialog.Root
      open={isTaskDetailsModalOpen}
      onOpenChange={setIsTaskDetailsModalOpen}
    >
      <Dialog.Trigger asChild>
        <TaskCardContainer
          onClick={() => setIsTaskDetailsModalOpen(true)}
          className={`task-card${isDragging ? ' dragging' : ''}`}
          ref={isTaskDetailsModalOpen ? null : provided.innerRef}
          {...dragProps}
          {...dragHandle}
          style={dragStyle}
        >
          {task?.tags && task?.tags?.length > 0 && (
            <TagsContainer>
              {task.tags.map((item) => {
                const hex = getTagHex(item.color)
                return (
                  <Tag
                    key={item.id}
                    style={{ backgroundColor: `${hex}1a`, color: hex }}
                  >
                    {item.name}
                  </Tag>
                )
              })}
            </TagsContainer>
          )}

          <strong>{task.name}</strong>

          {completedSubtasks > 0 && (
            <ProgressWrapper>
              <ProgressContainer>
                <ProgressFill progress={progress} />
              </ProgressContainer>
            </ProgressWrapper>
          )}

          <InfoContent>
            <InfoItem>
              <FontAwesomeIcon icon={faListCheck} />
              <p>{`${completedSubtasks}/${totalSubtasks}`}</p>
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
