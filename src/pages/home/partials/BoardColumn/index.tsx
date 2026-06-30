import { RefObject, useRef, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faEllipsis,
  faInbox,
  faPen,
} from '@fortawesome/free-solid-svg-icons'
import { BoardColumnProps } from '@/@types/board-column'
import {
  AddTaskButton,
  ColumnHeader,
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
import { TaskCard, taskSortableId } from '../TaskCard'

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

  // A column is a droppable target identified by its stable id (not its
  // position), so dropping into an empty column still resolves correctly.
  const { setNodeRef } = useDroppable({
    id: columnDroppableId(column.id),
    data: { type: 'column', columnId: column.id },
  })

  return (
    <>
      <Panel>
        <ColumnHeader>
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
          <TasksContainer ref={setNodeRef}>
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
