import { RefObject, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp, faX } from '@fortawesome/free-solid-svg-icons'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
  CloseButton,
  HeaderContent,
  ModalContent,
  ModalOverlay,
  ModalTitle,
  SelectStatusField,
  StatusContainer,
  StatusSelectorContainer,
} from '@/styles/shared'
import { FormContainer } from '@/components/Shared/FormContainer'
import { InputContainer } from '@/components/Shared/InputContainer'
import { Button } from '@/components/Shared/Button'
import { FieldsContainer } from '@/components/Shared/FieldsContainer'
import { Field } from '@/components/Shared/Field'
import { CustomTextarea } from '@/components/Shared/TextArea'
import { CustomInput } from '@/components/Shared/Input'
import { CustomLabel } from '@/components/Shared/Label'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { StatusSelector } from '@/components/Shared/StatusSelector'

import { useOutsideClick } from '@/utils/useOutsideClick'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'

import {
  StyledDatePickerWrapper,
  SubtasksForm,
  SubtasksWrapper,
} from './styles'

import { SubtaskProps } from '@/@types/subtask'
import { TaskProps } from '@/@types/task'
import toast from 'react-hot-toast'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'
import { useTaskForm } from '@/hooks/useTaskForm'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { TagsSection } from '@/components/Shared/TagsSection'

interface AddTaskModalProps {
  isEditing?: boolean
  task?: TaskProps
  onClose: () => void
}

export function TaskFormModal({
  onClose,
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
  } = useTaskForm({ isEditing, task, onClose })

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
    <Dialog.Portal>
      <ModalOverlay className="DialogOverlay" onClick={handleClose} />
      <ModalContent padding="1.5rem 1.5rem 2rem" className="DialogContent xl">
        <HeaderContent>
          <ModalTitle className="DialogTitle">
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <FontAwesomeIcon icon={faX} />
          </CloseButton>
        </HeaderContent>

        <VisuallyHidden>
          <Dialog.Description />
        </VisuallyHidden>

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

          <StatusContainer>
            <CustomLabel>Status</CustomLabel>
            <SelectStatusField
              className={isOptionsContainerOpen ? 'active' : ''}
              onClick={() => setIsOptionsContainerOpen((prev) => !prev)}
            >
              <p>{status}</p>
              <FontAwesomeIcon
                icon={isOptionsContainerOpen ? faAngleUp : faAngleDown}
              />
            </SelectStatusField>
            {isOptionsContainerOpen && (
              <StatusSelectorContainer ref={statusRef}>
                {activeBoard?.columns?.map((column) => (
                  <StatusSelector
                    key={column.name}
                    column={column}
                    status={status}
                    handleChangeStatus={() => {
                      handleChangeStatus(column.name, column.id as string)
                      setIsOptionsContainerOpen(false)
                    }}
                  />
                ))}
              </StatusSelectorContainer>
            )}
            {<ErrorMessage message={errors.status?.message} />}
          </StatusContainer>

          <Button
            title={isEditing ? 'Edit Task' : 'Create Task'}
            type="submit"
            variant="primary"
          />
        </FormContainer>
      </ModalContent>

      {isLoading && <LoadingComponent />}
    </Dialog.Portal>
  )
}
