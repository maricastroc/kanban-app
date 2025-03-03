/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import DatePicker from 'react-datepicker'
import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleDown,
  faAngleUp,
  faCheck,
  faX,
} from '@fortawesome/free-solid-svg-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
  CheckedBox,
  CloseButton,
  HeaderContent,
  ModalContent,
  ModalOverlay,
  ModalTitle,
  SelectStatusField,
  StatusContainer,
  StatusSelectorContainer,
  TagContainer,
  TagName,
  UncheckedBox,
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
  TagsContainer,
} from './styles'
import { initialSubtasks } from '@/utils/getInitialValues'
import { MIN_SUBTASKS, MIN_TITLE_LENGTH } from '@/utils/constants'

import { SubtaskProps } from '@/@types/subtask'
import { TaskProps } from '@/@types/task'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import toast from 'react-hot-toast'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { TagProps } from '@/@types/tag'
import { tagColors } from '@/components/Shared/SelectInput'
import useRequest from '@/utils/useRequest'
import { TagsTitle } from '../TagsModal/styles'
import { TagMark } from '../TaskDetailsModal/styles'

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
  status: z.string(),
  dueDate: z.date().optional(),
})

export type FormData = z.infer<typeof formSchema>

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

  const { activeBoard, mutate } = useBoardsContext()

  const [isOptionsContainerOpen, setIsOptionsContainerOpen] = useState(false)

  const [columnId, setColumnId] = useState<string | undefined>()

  const [isLoading, setIsLoading] = useState(false)

  const [taskTags, setTaskTags] = useState<TagProps[]>([])

  const [subtasks, setSubtasks] = useState<SubtaskProps[]>(
    isEditing && task?.subtasks ? task.subtasks : initialSubtasks,
  )

  const [status, setStatus] = useState(
    isEditing && task?.status ? task.status : '',
  )

  useOutsideClick(statusRef as RefObject<HTMLElement>, () =>
    setIsOptionsContainerOpen(false),
  )

  useEscapeKeyHandler(onClose)

  const { data: tags } = useRequest<TagProps[]>({
    url: '/tags',
    method: 'GET',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: uuidv4(),
      title: task?.title ?? '',
      description: task?.description ?? '',
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
      status,
      subtasks,
    },
  })

  const subtasksValues = watch('subtasks')

  const handleSubmitTask = async (data: FormData) => {
    try {
      setIsLoading(true)

      const payload = {
        boardId: activeBoard?.id,
        title: data.title,
        description: data.description || '',
        columnId,
        status,
        dueDate: data.dueDate || undefined,
        subtasks: subtasks.map((subtask, index) => ({
          ...subtask,
          order: index,
        })),
        tags: taskTags,
      }

      const response = isEditing
        ? await api.put('/tasks/edit', { ...payload, taskId: task?.id })
        : await api.post('/tasks/create', payload)

      mutate()
      toast.success(response.data.message)
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
      setSubtasks(initialSubtasks)
      reset()
      setTaskTags([])
      setTimeout(onClose, 500)
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

  useEffect(() => {
    if (activeBoard && !isEditing) {
      setStatus(activeBoard?.columns[0]?.name)
      setValue('status', activeBoard?.columns[0]?.name)
      setColumnId(activeBoard?.columns[0]?.id)
    }
  }, [activeBoard, isEditing])

  useEffect(() => {
    if (isEditing && task?.tags) {
      const taskTags = tags?.filter((tag) => {
        return tag.id
      })

      const matchedTags = taskTags?.filter((taskTag) => {
        return task?.tags.some((tag) => tag.tagId === taskTag.id)
      })

      setTaskTags(matchedTags as TagProps[])
    }
  }, [isEditing, task?.tags, tags])
  return (
    <Dialog.Portal>
      <ModalOverlay
        className="DialogOverlay"
        onClick={() => {
          onClose()
          setSubtasks(initialSubtasks)
          setTaskTags([])
          reset()
        }}
      />
      <ModalContent padding="1.5rem 1.5rem 2rem" className="DialogContent xl">
        <HeaderContent>
          <ModalTitle className="DialogTitle">
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </ModalTitle>
          <CloseButton
            onClick={() => {
              onClose()
              setSubtasks(initialSubtasks)
              setTaskTags([])
              reset()
            }}
          >
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

          <InputContainer>
            <CustomLabel htmlFor="dueDate">Due Date</CustomLabel>

            <StyledDatePickerWrapper>
              <DatePicker
                placeholderText="dd/mm/yyyy"
                customInput={<CustomInput />}
                selected={watch('dueDate')}
                dateFormat="dd/MM/yyyy"
                onChange={(date) => setValue('dueDate', date as Date)}
              />
            </StyledDatePickerWrapper>

            {<ErrorMessage message={errors.dueDate?.message} />}
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
              type="button"
              title="+ Add New Subtask"
              onClick={handleAddSubtask}
            />
          </SubtasksForm>

          <TagsContainer>
            <TagsTitle>Tags</TagsTitle>
            {tags &&
              tags.length > 0 &&
              tags.map((item) => {
                const tagColor = tagColors.find(
                  (tag) => tag.name === item.color,
                )?.color

                const isChecked = taskTags.some((tag) => tag.id === item.id)

                return (
                  <TagContainer key={item.id}>
                    {isChecked ? (
                      <CheckedBox
                        type="button"
                        onClick={() =>
                          setTaskTags(
                            taskTags.filter((tag) => tag.id !== item.id),
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </CheckedBox>
                    ) : (
                      <UncheckedBox
                        type="button"
                        onClick={() => {
                          setTaskTags([...taskTags, item])
                        }}
                      />
                    )}
                    <TagName>
                      <p>{item.name}</p>
                      <TagMark color={tagColor as string} />
                    </TagName>
                  </TagContainer>
                )
              })}
          </TagsContainer>

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

      {isLoading && <LoadingComponent />}
    </Dialog.Portal>
  )
}
