import { RefObject, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
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

import { useTaskContext } from '@/contexts/TasksContext'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'

import { SubtasksForm, SubtasksWrapper } from './styles'
import { initialSubtasks } from '@/utils/getInitialValues'
import {
  DEFAULT_STATUS,
  MIN_SUBTASKS,
  MIN_TITLE_LENGTH,
} from '@/utils/constants'

import { SubtaskProps } from '@/@types/subtask'
import { TaskProps } from '@/@types/task'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import useRequest from '@/utils/useRequest'
import { BoardProps } from '@/@types/board'
import toast from 'react-hot-toast'

const subtaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: 'Subtask title is required' }),
  isCompleted: z.boolean(),
})

const formSchema = z.object({
  id: z.string(),
  title: z.string().min(MIN_TITLE_LENGTH, { message: 'Title is required' }),
  description: z.string().optional(),
  subtasks: z
    .array(subtaskSchema)
    .min(MIN_SUBTASKS, { message: 'At least one subtask is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
})

export type FormData = z.infer<typeof formSchema>

interface AddTaskModalProps {
  isEditing?: boolean
  task?: TaskProps
  boardId: string
  mutate: any
  onClose: () => void
}

export function TaskFormModal({
  onClose,
  boardId,
  mutate,
  isEditing = false,
  task,
}: AddTaskModalProps) {
  const { data: activeBoard } =
    useRequest<BoardProps>({
      url: '/board',
      method: 'GET',
  })

  const { addTaskToColumn, editTask } = useTaskContext()

  const initialStatus = activeBoard?.columns[0]?.name || DEFAULT_STATUS

  const statusRef = useRef<HTMLDivElement | null>(null)

  const [isOptionsContainerOpen, setIsOptionsContainerOpen] = useState(false)

  const [columnId, setColumnId] = useState<string | undefined>()

  const [subtasks, setSubtasks] = useState<SubtaskProps[]>(
    isEditing && task?.subtasks ? task.subtasks : initialSubtasks,
  )

  const [status, setStatus] = useState(
    isEditing && task?.status ? task.status : initialStatus,
  )

  useOutsideClick(statusRef as RefObject<HTMLElement>, () => setIsOptionsContainerOpen(false))

  useEscapeKeyHandler(onClose)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    reset,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: uuidv4(),
      title: task?.title ?? '',
      description: task?.description ?? '',
      subtasks,
      status,
    },
  })

  const subtasksValues = watch('subtasks')

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        boardId,
        title: data.title,
        description: data.description || '',
        columnId,
        subtasks: subtasks.map((subtask, index) => ({
          ...subtask,
          order: index,
        })),
      }

      const response = await api.post('/tasks/create', payload);

      mutate()

      toast?.success(response.data.message)

      setTimeout(() => {
        onClose()
      }, 500)
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleAddSubtask = () => {
    const newSubtask: SubtaskProps = {
      id: uuidv4(),
      title: '',
      isCompleted: false,
    }

    const updatedSubtasks = [...subtasks, newSubtask]

    setSubtasks(updatedSubtasks)
    setValue('subtasks', updatedSubtasks)
  }

  const handleChangeSubtask = (index: number, newValue: string) => {
    const updatedSubtasks = subtasksValues.map((task, i) =>
      i === index ? { ...task, title: newValue } : task,
    )

    setSubtasks(updatedSubtasks)
    setValue('subtasks', updatedSubtasks)
  }

  const handleChangeStatus = (newStatus: string) => {
    setStatus(newStatus)
    setValue('status', newStatus)
    setIsOptionsContainerOpen(false)
  }

  const handleSetColumnId = (value: string) => {
    setColumnId(value)
  }

  const handleRemoveSubtask = (indexToRemove: number) => {
    const updatedSubtasks = getValues('subtasks').filter(
      (_, index) => index !== indexToRemove,
    )
    setSubtasks(updatedSubtasks)

    setValue('subtasks', updatedSubtasks)
  }

  const handleSubmitTask = async (data: FormData) => {
    const isValid = await trigger('subtasks')

    if (!isValid) {
      toast.error('Please correct the errors before submitting the task.')
      return
    }

    const newTask = {
      id: uuidv4(),
      order: 1,
      title: data.title,
      description: data.description || '',
      status: status || DEFAULT_STATUS,
      subtasks,
    }

    if (isEditing) {
      editTask(newTask, task)
    } else {
      addTaskToColumn(newTask, status)
    }

    reset()
    setSubtasks(initialSubtasks)
    onClose()
  }

  const renderSubtaskInput = (index: number, subtask: SubtaskProps) => {
    const error = errors.subtasks?.[index]?.title?.message

    return (
      <FieldsContainer>
        <Field
          hasError={!!error}
          placeholder="e.g. Make coffee"
          defaultValue={subtask.title}
          btnVariant={subtasks.length > 1 ? '' : 'disabled'}
          onChange={(e) => handleChangeSubtask(index, e.target.value)}
          onClick={() => {
            handleRemoveSubtask(index)
          }}
        />
        {error && <ErrorMessage message={error} />}
      </FieldsContainer>
    )
  }

  return (
    <Dialog.Portal>
      <ModalOverlay className="DialogOverlay" onClick={onClose} />
      <ModalContent padding="1.5rem 1.5rem 2rem" className="DialogContent xl">
        <ModalTitle className="DialogTitle">
          {isEditing ? 'Edit Task' : 'Add New Task'}
        </ModalTitle>
        <VisuallyHidden>
          <Dialog.Description />
        </VisuallyHidden>
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <InputContainer>
            <CustomLabel htmlFor="title">Title</CustomLabel>
            <CustomInput
              hasError={!!errors.title}
              placeholder="e.g. Take coffee break"
              {...register('title')}
            />
            {<ErrorMessage message={errors.title?.message} />}
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

          <SubtasksForm>
            <CustomLabel>Subtasks</CustomLabel>
            <SubtasksWrapper>
              {subtasks.map((subtask, index) => (
                <div key={`${subtask.title}-${index}`}>
                  {renderSubtaskInput(index, subtask)}
                </div>
              ))}
            </SubtasksWrapper>
            <Button
              variant="secondary"
              title="+ Add New Subtask"
              onClick={handleAddSubtask}
            />
          </SubtasksForm>

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
                      handleChangeStatus(column.name)
                      handleSetColumnId(column.id || '')
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
    </Dialog.Portal>
  )
}
