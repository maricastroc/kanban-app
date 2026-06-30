import { RefObject, useRef, useState } from 'react'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faEllipsis,
  faInbox,
  faPen,
  faGripVertical,
} from '@fortawesome/free-solid-svg-icons'
import { BoardColumnProps } from '@/@types/board-column'
import {
  AddTaskButton,
  ColumnHeader,
  DragHandle,
  EmptyTasksContainer,
  MenuButton,
  MenuContainer,
  MenuDropdown,
  Panel,
  TasksContainer,
} from './styles'
import { TaskFormModal } from '@/components/Modals/TaskFormModal'
import { BoardFormModal } from '@/components/Modals/BoardFormModal'
import { MenuDivider, MenuItem } from '@/components/Core/Menu/styles'
import { useClickOutside } from '@/utils/useClickOutside'
import { CardContent, TaskCard, taskSortableId } from '../TaskCard'
import { TaskCardContainer } from '../TaskCard/styles'

export const columnDroppableId = (id: BoardColumnProps['id']) => `column-${id}`

type ColumnProps = BoardColumnProps & {
  column: BoardColumnProps
  dragDisabled: boolean
}

export function BoardColumn({
  name,
  tasks,
  column,
  dragDisabled,
}: ColumnProps) {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isEditBoardOpen, setIsEditBoardOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  useClickOutside(menuRef as RefObject<HTMLElement>, () => {
    if (isMenuOpen) setIsMenuOpen(false)
  })

  const isEmpty = column?.tasks?.length === 0

  // The column is both a sortable item (horizontal reorder) and the droppable
  // target for tasks — one stable id (`column-<id>`) serves both, so dropping
  // into an empty column and reordering columns can't desync from positions.
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: columnDroppableId(column.id),
    data: { type: 'column', column, columnId: column.id },
    disabled: dragDisabled,
  })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
  }

  return (
    <>
      <Panel ref={setNodeRef} style={style}>
        <ColumnHeader>
          <DragHandle
            ref={setActivatorNodeRef}
            type="button"
            className="column-drag-handle"
            aria-label="Drag to reorder column"
            {...attributes}
            {...listeners}
          >
            <FontAwesomeIcon icon={faGripVertical} />
          </DragHandle>
          <span className="name">{name}</span>
          <span className="count">{tasks.length}</span>
          <MenuContainer ref={menuRef}>
            <MenuButton
              type="button"
              aria-label="Column options"
              className={`menu ${isMenuOpen ? 'is-open' : ''}`}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </MenuButton>
            {isMenuOpen && (
              <MenuDropdown>
                <MenuItem
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setIsAddTaskOpen(true)
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add task
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setIsEditBoardOpen(true)
                  }}
                >
                  <FontAwesomeIcon icon={faPen} />
                  Edit column
                </MenuItem>
              </MenuDropdown>
            )}
          </MenuContainer>
        </ColumnHeader>

        <SortableContext
          items={tasks.map((task) => taskSortableId(task.id))}
          strategy={verticalListSortingStrategy}
        >
          <TasksContainer>
            {tasks.map((task) => (
              <TaskCard
                key={String(task.id)}
                column={column}
                task={task}
                dragDisabled={dragDisabled}
              />
            ))}
            {isEmpty && (
              <EmptyTasksContainer>
                <FontAwesomeIcon icon={faInbox} />
                <span>Drop tasks here</span>
              </EmptyTasksContainer>
            )}
          </TasksContainer>
        </SortableContext>

        <AddTaskButton
          type="button"
          className="add-task"
          onClick={() => setIsAddTaskOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add task
        </AddTaskButton>
      </Panel>

      <Dialog.Root open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <TaskFormModal
          isEditing={false}
          column={column}
          onClose={() => setIsAddTaskOpen(false)}
        />
      </Dialog.Root>

      <Dialog.Root open={isEditBoardOpen} onOpenChange={setIsEditBoardOpen}>
        <BoardFormModal isEditing onClose={() => setIsEditBoardOpen(false)} />
      </Dialog.Root>
    </>
  )
}

// Rendered inside the DndContext's <DragOverlay> while a column is being
// dragged. Purely presentational — no sortable hooks (which would re-register
// the column/task ids already mounted in the board) — so it just mirrors the
// column's chrome and cards as a ghost that follows the cursor.
export function ColumnOverlay({ column }: { column: BoardColumnProps }) {
  const isEmpty = column.tasks.length === 0

  return (
    <Panel className="drag-overlay">
      <ColumnHeader>
        <DragHandle as="span" className="column-drag-handle" aria-hidden>
          <FontAwesomeIcon icon={faGripVertical} />
        </DragHandle>
        <span className="name">{column.name}</span>
        <span className="count">{column.tasks.length}</span>
      </ColumnHeader>

      <TasksContainer>
        {column.tasks.map((task) => (
          <TaskCardContainer key={String(task.id)} className="task-card">
            <CardContent task={task} />
          </TaskCardContainer>
        ))}
        {isEmpty && (
          <EmptyTasksContainer>
            <FontAwesomeIcon icon={faInbox} />
            <span>Drop tasks here</span>
          </EmptyTasksContainer>
        )}
      </TasksContainer>
    </Panel>
  )
}
