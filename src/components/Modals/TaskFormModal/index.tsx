import { RefObject, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faHeading,
  faAlignLeft,
  faCalendar,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons'
import {
  AddSubtaskBtn,
  StyledDatePickerWrapper,
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
    handleChangeStatus,
    handleSubmitTask,
    watch,
  } = useTaskForm({ isEditing, column, task, onClose })

  useClickOutside(statusRef as RefObject<HTMLElement>, () =>
    setIsOptionsContainerOpen(false),
  )

  useEscapeKey(onClose)

  const submitForm = handleSubmit(handleSubmitTask)

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
          isDisabled={subtasks.length <= 1 && isEditing}
          placeholder="e.g. Make coffee"
          defaultValue={subtask.name}
          btnVariant={subtasks.length > 1 ? '' : 'disabled'}
          onChange={(e) => handleChangeSubtask(index, e.target.value)}
          onClick={() => {
            if (subtasks?.length > 1) {
              handleRemoveSubtask(index)
            } else {
              toast.error('Task must have at least one subtask.')
            }
          }}
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
              {subtasks.map((subtask, index) => (
                <div key={`${subtask.name}-${index}`}>
                  {renderSubtaskInput(index, subtask)}
                </div>
              ))}
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
