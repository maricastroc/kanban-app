/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  CompleteToggle,
  DueDateBadge,
  InfoContent,
  InfoItem,
  ProgressContainer,
  ProgressFill,
  ProgressWrapper,
  Tag,
  TagsContainer,
  TaskCardContainer,
  TaskTitleRow,
} from './styles'
import { TaskDetailsModal } from '@/components/Modals/TaskDetailsModal'
import { getTagStyle } from '@/utils/getTagHex'
import { TaskProps } from '@/@types/task'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useTheme } from '@/contexts/ThemeContext'
import { BoardColumnProps } from '@/@types/board-column'
import { formatDate } from '@/utils/formatDate'
import { getDueStatus, getDueLabel } from '@/utils/getDueStatus'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import {
  faCheck,
  faCircleCheck,
  faClock,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons'
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

  const { activeBoardMutate } = useBoardsContext()
  const { enableDarkMode } = useTheme()
  const [isCompleted, setIsCompleted] = useState(!!task.is_completed)
  const [isToggling, setIsToggling] = useState(false)

  const dueStatus = task?.due_date
    ? getDueStatus(task.due_date, isCompleted)
    : ''
  const dueLabel = task?.due_date ? getDueLabel(task.due_date, isCompleted) : ''

  async function handleToggleCompletion(event: React.MouseEvent) {
    // The card is both a drag handle and the modal trigger, so stop the toggle
    // click from starting a drag or opening the details modal.
    event.preventDefault()
    event.stopPropagation()
    if (isToggling) return

    const next = !isCompleted
    setIsCompleted(next)
    setIsToggling(true)

    try {
      await api.patch(`/tasks/${task.id}/toggle-completion`)
      await activeBoardMutate()
    } catch (error) {
      setIsCompleted(!next)
      handleApiError(error)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <>
      {task?.tags && task?.tags?.length > 0 && (
        <TagsContainer>
          {task.tags.map((item) => (
            <Tag key={item.id} style={getTagStyle(item.color, enableDarkMode)}>
              {item.name}
            </Tag>
          ))}
        </TagsContainer>
      )}

      <TaskTitleRow className={isCompleted ? 'completed' : ''}>
        <CompleteToggle
          type="button"
          className={isCompleted ? 'completed' : ''}
          onClick={handleToggleCompletion}
          onPointerDown={(event) => event.stopPropagation()}
          disabled={isToggling}
          aria-pressed={isCompleted}
          aria-label={
            isCompleted ? 'Mark task as not done' : 'Mark task as done'
          }
        >
          {isCompleted ? (
            <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
          ) : null}
        </CompleteToggle>
        <strong>{task.name}</strong>
      </TaskTitleRow>

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
          <DueDateBadge className={dueStatus} title={dueLabel || undefined}>
            <FontAwesomeIcon
              icon={isCompleted ? faCircleCheck : faClock}
              aria-hidden="true"
            />
            <span>{formatDate(task.due_date)}</span>
          </DueDateBadge>
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

  // Tasks reorder by pointer (drag anywhere on the card). We keep only the
  // pointer activator and not the keyboard one, so that for keyboard users
  // Enter/Space opens the task instead of starting a drag. (Columns carry the
  // keyboard-drag affordance on their dedicated handle.)
  const { listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
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

  const openDetails = () => setIsTaskDetailsModalOpen(true)

  return (
    <Dialog.Root
      open={isTaskDetailsModalOpen}
      onOpenChange={setIsTaskDetailsModalOpen}
    >
      <TaskCardContainer
        ref={setNodeRef}
        style={style}
        className={`task-card${dragDisabled ? ' drag-disabled' : ''}`}
        role="button"
        tabIndex={0}
        aria-label={`Open task: ${task.name}`}
        onClick={openDetails}
        {...listeners}
        onKeyDown={(event) => {
          // Keep keyboard focus opening the task: ignore keys bubbling up from
          // the completion toggle, and override dnd-kit's own key handler so
          // Enter/Space opens the details instead of starting a drag.
          if (event.target !== event.currentTarget) return
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openDetails()
          }
        }}
      >
        <CardContent task={task} />
      </TaskCardContainer>
      <TaskDetailsModal
        task={task}
        column={column}
        onClose={() => setIsTaskDetailsModalOpen(false)}
      />
    </Dialog.Root>
  )
}
