import { useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleDown,
  faAngleUp,
  faCheck,
} from '@fortawesome/free-solid-svg-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  StatusOptionsWrapper,
  SubtasksForm,
  StatusOptionsContainer,
  SelectStatusContainer,
  SubtasksWrapper,
} from './styles'
import { ModalContent, ModalOverlay, ModalTitle } from '@/styles/shared'
import { FormContainer } from '@/components/Shared/FormContainer'
import { InputContainer } from '@/components/Shared/InputContainer'
import { Button } from '@/components/Shared/Button'
import { FieldsContainer } from '@/components/Shared/FieldsContainer'
import { Field } from '@/components/Shared/Field'
import { CustomTextarea } from '@/components/Shared/TextArea'
import { CustomInput } from '@/components/Shared/Input'
import { CustomLabel } from '@/components/Shared/Label'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useTaskContext } from '@/contexts/TasksContext'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { SubtaskProps } from '@/@types/subtask'
import { initialSubtasks } from '@/utils/getInitialValues'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { toast } from 'react-toastify'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'

const subtaskSchema = z.object({
  title: z.string().min(1, { message: 'Subtask title is required' }),
  isCompleted: z.boolean().optional(),
})

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title is required' }),
  description: z.string().optional(),
  subtasks: z
    .array(subtaskSchema)
    .min(1, { message: 'At least one subtask is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
})

export type FormData = z.infer<typeof formSchema>

interface AddTaskModalProps {
  onClose: () => void
}

export function AddTaskModal({ onClose }: AddTaskModalProps) {
  const { activeBoard } = useBoardsContext()

  const { addTaskToColumn } = useTaskContext()

  const initialStatus = activeBoard?.columns[0]?.name || 'Not specified'

  const statusRef = useRef<HTMLDivElement | null>(null)

  useOutsideClick(statusRef, () => setOpenOptionsContainer(false))

  useEscapeKeyHandler(onClose)

  const [openOptionsContainer, setOpenOptionsContainer] = useState(false)

  const [subtasks, setSubtasks] = useState<SubtaskProps[]>(initialSubtasks)

  const [status, setStatus] = useState(initialStatus)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      subtasks:
        subtasks.length > 0 ? subtasks : [{ title: '', isCompleted: false }],
      status: initialStatus,
    },
  })

  const handleAddSubtask = () => {
    const newSubtask = { title: '', isCompleted: false }
    setSubtasks((prev) => [...prev, newSubtask])
    setValue('subtasks', [...subtasks, newSubtask])
  }

  const handleChangeSubtask = (index: number, newValue: string) => {
    setSubtasks((prev) =>
      prev.map((subtask, i) =>
        i === index ? { ...subtask, title: newValue } : subtask,
      ),
    )
    setValue(`subtasks.${index}.title`, newValue)
  }

  const handleChangeStatus = (newStatus: string) => {
    setStatus(newStatus)
    setValue('status', newStatus)
    setOpenOptionsContainer(false)
  }

  const handleRemoveSubtask = (indexToRemove: number) => {
    setSubtasks((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleAddTask = async (data: FormData) => {
    const isValid = await trigger('subtasks')

    if (!isValid) {
      toast.error('Please correct the errors before submitting the task.')
      return
    }

    const newTask = {
      title: data.title,
      description: data.description || '',
      status: status || 'Not specified',
      subtasks,
    }

    addTaskToColumn(newTask, status)

    setSubtasks(initialSubtasks)

    reset()

    onClose()
  }

  const renderSubtaskInput = (index: number, subtask: SubtaskProps) => {
    const error = errors.subtasks?.[index]?.title?.message

    return (
      <FieldsContainer key={index}>
        <Field
          hasError={!!error}
          placeholder="e.g. Make coffee"
          value={subtask.title}
          onChange={(e) => handleChangeSubtask(index, e.target.value)}
          onClick={() => handleRemoveSubtask(index)}
        />
        {error && <ErrorMessage message={error} />}
      </FieldsContainer>
    )
  }

  return (
    <Dialog.Portal>
      <ModalOverlay className="DialogOverlay" onClick={onClose} />
      <ModalContent padding="1.5rem 1.5rem 3rem" className="DialogContent" aria-describedby={undefined}>
        <ModalTitle className="DialogTitle">Add Task</ModalTitle>
        <VisuallyHidden>
          <Dialog.Description />
        </VisuallyHidden>
        <FormContainer onSubmit={handleSubmit(handleAddTask)}>
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
              {subtasks.map((subtask, index) =>
                renderSubtaskInput(index, subtask),
              )}
            </SubtasksWrapper>
            <Button
              type="button"
              variant="secondary"
              title="+ Add New Subtask"
              onClick={handleAddSubtask}
            />
          </SubtasksForm>

          <StatusOptionsWrapper>
            <CustomLabel>Status</CustomLabel>
            <StatusOptionsContainer
              className={openOptionsContainer ? 'active' : ''}
              onClick={() => setOpenOptionsContainer((prev) => !prev)}
            >
              <p>{status}</p>
              <FontAwesomeIcon
                icon={openOptionsContainer ? faAngleUp : faAngleDown}
              />
            </StatusOptionsContainer>
            {openOptionsContainer && (
              <SelectStatusContainer ref={statusRef}>
                {activeBoard?.columns?.map((column) => (
                  <button
                    type="button"
                    key={column.name}
                    onClick={() => handleChangeStatus(column.name)}
                    {...register('status')}
                  >
                    {status === column.name && (
                      <FontAwesomeIcon icon={faCheck} />
                    )}
                    <span>{column.name}</span>
                  </button>
                ))}
              </SelectStatusContainer>
            )}
            {<ErrorMessage message={errors.status?.message} />}
          </StatusOptionsWrapper>

          <Button title="Create Task" type="submit" variant="primary" />
        </FormContainer>
      </ModalContent>
    </Dialog.Portal>
  )
}
