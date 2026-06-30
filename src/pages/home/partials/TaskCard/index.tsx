/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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

export const taskSortableId = (id: TaskProps['id']) => `task-${id}`

type TaskCardProps = {
  task: TaskProps
  column: BoardColumnProps
  dragDisabled?: boolean
  dragOverlay?: boolean
}

export function CardContent({ task }: { task: TaskProps }) {
  const totalSubtasks = task?.subtasks?.length || 0
  const completedSubtasks =
    task?.subtasks?.filter((subtask) => subtask?.is_completed)?.length || 0
  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

  return (
    <>
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
          <InfoItem className={`${getDueStatus(task.due_date, task.subtasks)}`}>
            <FontAwesomeIcon icon={faClock} />
            <p>{formatDate(task.due_date)}</p>
          </InfoItem>
        )}
      </InfoContent>
    </>
  )
}

export function TaskCard({
  task,
  column,
  dragDisabled,
  dragOverlay,
}: TaskCardProps) {
  const { handleEnableScrollFeature } = useBoardsContext()

  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false)

  useEffect(() => {
    handleEnableScrollFeature(!isTaskDetailsModalOpen)
  }, [isTaskDetailsModalOpen])

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: taskSortableId(task.id),
    data: { type: 'task', task, columnId: column.id },
    disabled: dragDisabled || dragOverlay,
  })

  if (dragOverlay) {
    return (
      <TaskCardContainer className="task-card dragging">
        <CardContent task={task} />
      </TaskCardContainer>
    )
  }

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
  }

  return (
    <Dialog.Root
      open={isTaskDetailsModalOpen}
      onOpenChange={setIsTaskDetailsModalOpen}
    >
      <Dialog.Trigger asChild>
        <TaskCardContainer
          ref={setNodeRef}
          style={style}
          className={`task-card${dragDisabled ? ' drag-disabled' : ''}`}
          onClick={() => setIsTaskDetailsModalOpen(true)}
          {...attributes}
          {...listeners}
        >
          <CardContent task={task} />
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
