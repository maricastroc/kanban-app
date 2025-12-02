import { RefObject, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import toast from 'react-hot-toast'
import {
  StyledDatePickerWrapper,
  SubtasksForm,
  SubtasksWrapper,
} from './styles'

import { FormContainer } from '@/components/Core/FormContainer'
import { InputContainer } from '@/components/Core/InputContainer'
import { Button } from '@/components/Core/Button'
import { FieldsContainer } from '@/components/Core/FieldsContainer'
import { Field } from '@/components/Core/Field'
import { CustomTextarea } from '@/components/Core/TextArea'
import { CustomInput } from '@/components/Core/Input'
import { CustomLabel } from '@/components/Core/Label'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { TagsSection } from '@/components/Shared/TagsSection'
import { BaseModal } from '../BaseModal'

import { useOutsideClick } from '@/utils/useOutsideClick'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'

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

  useOutsideClick(statusRef as RefObject<HTMLElement>, () =>
    setIsOptionsContainerOpen(false),
  )

  useEscapeKeyHandler(onClose)

  const renderSubtaskInput = (index: number, subtask: SubtaskProps) => {
    const error = errors.subtasks?.[index]?.name?.message

    return (
      <FieldsContainer>
        <Field
          hasError={!!error}
          isDisabled={subtasks.length <= 1}
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
    <BaseModal
      isLoading={isLoading}
      onClose={handleClose}
      title={isEditing ? 'Edit Task' : 'Add New Task'}
      padding="1.5rem 1.5rem 2rem"
    >
      <FormContainer onSubmit={handleSubmit(handleSubmitTask)}>
        <InputContainer>
          <CustomLabel htmlFor="title">Title</CustomLabel>
          <CustomInput
            hasError={!!errors.name}
            placeholder="e.g. Take coffee break"
            {...register('name')}
          />
          {<ErrorMessage message={errors.name?.message} />}
        </InputContainer>

        <InputContainer>
          <CustomLabel htmlFor="description">Description</CustomLabel>
          <CustomTextarea
            hasError={!!errors.description}
            placeholder="e.g. Task description"
            {...register('description')}
          />
          {<ErrorMessage message={errors.description?.message} />}
        </InputContainer>

        <InputContainer>
          <CustomLabel htmlFor="due_date">Due Date</CustomLabel>
          <StyledDatePickerWrapper>
            <DatePicker
              placeholderText="dd/mm/yyyy"
              customInput={<CustomInput />}
              selected={watch('due_date')}
              dateFormat="dd/MM/yyyy"
              onChange={(date) => setValue('due_date', date as Date)}
            />
          </StyledDatePickerWrapper>
          {<ErrorMessage message={errors.due_date?.message} />}
        </InputContainer>

        <SubtasksForm>
          <CustomLabel>Subtasks</CustomLabel>
          <SubtasksWrapper>
            {subtasks.map((subtask, index) => (
              <div key={`${subtask.name}-${index}`}>
                {renderSubtaskInput(index, subtask)}
              </div>
            ))}

            {
              <ErrorMessage
                style={{ marginTop: '-0.5rem' }}
                message={errors?.subtasks?.message}
              />
            }
          </SubtasksWrapper>
          <Button
            variant="secondary"
            type="button"
            title="+ Add New Subtask"
            onClick={handleAddSubtask}
          />
        </SubtasksForm>

        <TagsSection
          taskTags={taskTags}
          onCheckedClick={(tag) =>
            setTaskTags((prev) => prev.filter((t) => t.id !== tag.id))
          }
          onUncheckedClick={(tag) => setTaskTags((prev) => [...prev, tag])}
        />

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

        {<ErrorMessage message={errors.status?.message} />}

        <Button
          title={isEditing ? 'Edit Task' : 'Create Task'}
          type="submit"
          variant="primary"
        />
      </FormContainer>
    </BaseModal>
  )
}
