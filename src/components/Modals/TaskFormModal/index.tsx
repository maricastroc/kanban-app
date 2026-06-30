import { ReactNode, RefObject, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faHeading,
  faAlignLeft,
  faCalendar,
  faListCheck,
  faGripVertical,
} from '@fortawesome/free-solid-svg-icons'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  AddSubtaskBtn,
  StyledDatePickerWrapper,
  SubtaskDragHandle,
  SubtaskRow,
  SubtasksWrapper,
} from './styles'
import { Sheet, Kbd } from '../Sheet'
import { Button } from '@/components/Core/Button'

import { FormContainer } from '@/components/Core/FormContainer'
import { FieldsContainer } from '@/components/Core/FieldsContainer'
import { Field } from '@/components/Core/Field'
import { CustomTextarea } from '@/components/Core/TextArea'
import { CustomInput } from '@/components/Core/Input'
import { Label } from '@/components/Core/Label'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { TagsSection } from '@/components/Shared/TagsSection'

import { useClickOutside } from '@/utils/useClickOutside'
import { useEscapeKey } from '@/utils/useEscapeKey'

import { SubtaskProps } from '@/@types/subtask'
import { TaskProps } from '@/@types/task'
import { useTaskForm } from '@/hooks/useTaskForm'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { StatusSection } from '../TaskDetailsModal/partials/StatusSection'
import { BoardColumnProps } from '@/@types/board-column'

interface AddTaskModalProps {
  column: BoardColumnProps
  isEditing?: boolean
  task?: TaskProps
  onClose: () => void
}

function SortableSubtaskField({
  id,
  children,
}: {
  id: string
  children: ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    position: 'relative',
    zIndex: isDragging ? 1 : undefined,
  }

  return (
    <SubtaskRow ref={setNodeRef} style={style}>
      <SubtaskDragHandle
        ref={setActivatorNodeRef}
        type="button"
        className="subtask-drag-handle"
        aria-label="Drag to reorder subtask"
        {...attributes}
        {...listeners}
      >
        <FontAwesomeIcon icon={faGripVertical} />
      </SubtaskDragHandle>
      {children}
    </SubtaskRow>
  )
}

export function TaskFormModal({
  onClose,
  column,
  isEditing = false,
  task,
}: AddTaskModalProps) {
  const statusRef = useRef<HTMLDivElement | null>(null)

  const { isLoading } = useBoardsContext()

  const [isOptionsContainerOpen, setIsOptionsContainerOpen] = useState(false)

  const {
    register,
    handleSubmit,
    errors,
    status,
    subtasks,
    activeBoard,
    taskTags,
    setValue,
    setTaskTags,
    resetForm,
    handleAddSubtask,
    handleChangeSubtask,
    handleRemoveSubtask,
    handleReorderSubtask,
    handleChangeStatus,
    handleSubmitTask,
    watch,
  } = useTaskForm({ isEditing, column, task, onClose })

  useClickOutside(statusRef as RefObject<HTMLElement>, () =>
    setIsOptionsContainerOpen(false),
  )

  useEscapeKey(onClose)

  const submitForm = handleSubmit(handleSubmitTask)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      submitForm()
    }
  }

  const renderSubtaskInput = (index: number, subtask: SubtaskProps) => {
    const error = errors.subtasks?.[index]?.name?.message

    return (
      <FieldsContainer>
        <Field
          hasError={!!error}
          placeholder="e.g. Make coffee"
          defaultValue={subtask.name}
          onChange={(e) => handleChangeSubtask(index, e.target.value)}
          onClick={() => handleRemoveSubtask(index)}
        />
        {error && <ErrorMessage message={error} />}
      </FieldsContainer>
    )
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  return (
    <Sheet isLoading={isLoading} onClose={handleClose}>
      <Sheet.Header
        icon={faPlus}
        title={isEditing ? 'Edit task' : 'Create task'}
        subtitle={
          isEditing
            ? 'Update the details of this task.'
            : `Add a new task to ${activeBoard?.name || 'this board'}.`
        }
        onClose={handleClose}
      />

      <Sheet.Body>
        <FormContainer
          id="task-form"
          onSubmit={submitForm}
          onKeyDown={handleFormKeyDown}
          style={{ marginTop: 0, gap: 0 }}
        >
          <Sheet.Section>
            <Sheet.FieldGroup>
              <Label htmlFor="title">
                <FontAwesomeIcon icon={faHeading} />
                Title
              </Label>
              <CustomInput
                hasError={!!errors.name}
                placeholder="e.g. Take coffee break"
                {...register('name')}
              />
              <ErrorMessage message={errors.name?.message} />
            </Sheet.FieldGroup>

            <Sheet.FieldGroup>
              <Label htmlFor="description">
                <FontAwesomeIcon icon={faAlignLeft} />
                Description
              </Label>
              <CustomTextarea
                hasError={!!errors.description}
                placeholder="e.g. Task description"
                {...register('description')}
              />
              <ErrorMessage message={errors.description?.message} />
            </Sheet.FieldGroup>
          </Sheet.Section>

          <Sheet.Divider />

          <Sheet.Section>
            <Sheet.FieldGroup>
              <Label htmlFor="due_date">
                <FontAwesomeIcon icon={faCalendar} />
                Due date
              </Label>
              <StyledDatePickerWrapper>
                <DatePicker
                  placeholderText="dd/mm/yyyy"
                  customInput={<CustomInput />}
                  selected={watch('due_date')}
                  dateFormat="dd/MM/yyyy"
                  popperProps={{ strategy: 'fixed' }}
                  onChange={(date) => setValue('due_date', date as Date)}
                />
              </StyledDatePickerWrapper>
              <ErrorMessage message={errors.due_date?.message} />
            </Sheet.FieldGroup>

            <TagsSection
              taskTags={taskTags}
              onCheckedClick={(tag) =>
                setTaskTags((prev) => prev.filter((t) => t.id !== tag.id))
              }
              onUncheckedClick={(tag) => setTaskTags((prev) => [...prev, tag])}
            />

            <Sheet.FieldGroup>
              <StatusSection
                statusRef={statusRef}
                activeBoard={activeBoard}
                handleChangeStatus={async (column) => {
                  handleChangeStatus(column.name, column.id as string)
                  setIsOptionsContainerOpen(false)
                }}
                isOpen={isOptionsContainerOpen}
                isActive={isOptionsContainerOpen}
                status={status}
                onToggleOpen={() => setIsOptionsContainerOpen(true)}
              />
              <ErrorMessage message={errors.status?.message} />
            </Sheet.FieldGroup>
          </Sheet.Section>

          <Sheet.Divider />

          <Sheet.Section>
            <Sheet.SectionLabel>
              <FontAwesomeIcon icon={faListCheck} />
              Subtasks
            </Sheet.SectionLabel>
            <SubtasksWrapper>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleReorderSubtask}
              >
                <SortableContext
                  items={subtasks.map((subtask) => String(subtask.id))}
                  strategy={verticalListSortingStrategy}
                >
                  {subtasks.map((subtask, index) => (
                    <SortableSubtaskField
                      key={subtask.id}
                      id={String(subtask.id)}
                    >
                      {renderSubtaskInput(index, subtask)}
                    </SortableSubtaskField>
                  ))}
                </SortableContext>
              </DndContext>
              <ErrorMessage
                style={{ marginTop: '-0.25rem' }}
                message={errors?.subtasks?.message}
              />
            </SubtasksWrapper>
            <AddSubtaskBtn type="button" onClick={handleAddSubtask}>
              <FontAwesomeIcon icon={faPlus} />
              Add subtask
            </AddSubtaskBtn>
          </Sheet.Section>
        </FormContainer>
      </Sheet.Body>

      <Sheet.Footer>
        <Button
          variant="secondary"
          fullWidth={false}
          type="button"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          fullWidth={false}
          type="submit"
          form="task-form"
        >
          {isEditing ? 'Save changes' : 'Create task'}
          <Kbd className="onAccent">⌘↵</Kbd>
        </Button>
      </Sheet.Footer>
    </Sheet>
  )
}
