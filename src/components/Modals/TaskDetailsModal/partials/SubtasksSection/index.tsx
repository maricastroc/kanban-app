import { SubtaskProps } from '@/@types/subtask'
import { EmptySubtask, SubtasksContainer } from './styles'
import { SubtaskItem } from '@/components/Core/SubtaskItem'
import { DragHandle } from '@/components/Core/DragHandle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripVertical } from '@fortawesome/free-solid-svg-icons'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  taskId: string | number | undefined
  subtasks?: SubtaskProps[]
  isReordering: boolean
  handleSetIsLoading: (value: boolean) => void
  handleSetSubtasks: (value: SubtaskProps[]) => void
  reorderSubtaskInTask: (taskId: string, newOrder: SubtaskProps[]) => void
}

interface SortableSubtaskItemProps {
  subtask: SubtaskProps
  disabled: boolean
  handleSetIsLoading: (value: boolean) => void
}

function SortableSubtaskItem({
  subtask,
  disabled,
  handleSetIsLoading,
}: SortableSubtaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(subtask.id), disabled })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    position: 'relative',
    zIndex: isDragging ? 1 : undefined,
  }

  return (
    <SubtaskItem
      id={subtask.id}
      name={subtask.name}
      isCompleted={subtask.is_completed}
      handleSetIsLoading={handleSetIsLoading}
      containerRef={setNodeRef}
      style={style}
      dragHandle={
        <DragHandle
          ref={setActivatorNodeRef}
          type="button"
          className="subtask-drag-handle"
          aria-label="Drag to reorder subtask"
          disabled={disabled}
          {...attributes}
          {...listeners}
        >
          <FontAwesomeIcon icon={faGripVertical} />
        </DragHandle>
      }
    />
  )
}

export const SubtasksSection = ({
  isReordering,
  taskId,
  subtasks,
  handleSetIsLoading,
  handleSetSubtasks,
  reorderSubtaskInTask,
}: Props) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!subtasks || !over || active.id === over.id) return

    const oldIndex = subtasks.findIndex(
      (s) => String(s.id) === String(active.id),
    )
    const newIndex = subtasks.findIndex((s) => String(s.id) === String(over.id))
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(subtasks, oldIndex, newIndex)
    handleSetSubtasks(reordered)
    reorderSubtaskInTask(taskId as string, reordered)
  }

  return subtasks && subtasks?.length > 0 ? (
    <SubtasksContainer>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={subtasks.map((subtask) => String(subtask.id))}
          strategy={verticalListSortingStrategy}
        >
          {subtasks.map((subtask) => (
            <SortableSubtaskItem
              key={subtask.id}
              subtask={subtask}
              disabled={isReordering}
              handleSetIsLoading={handleSetIsLoading}
            />
          ))}
        </SortableContext>
      </DndContext>
    </SubtasksContainer>
  ) : (
    <EmptySubtask>No subtasks.</EmptySubtask>
  )
}
