import { useState } from 'react'
import { useTaskContext } from '@/contexts/TaskContext'
import { useBoardsContext } from '@/contexts/BoardsContext'

import { Button } from '@/components/Button'
import { InputVariant } from '@/components/InputVariant'
import { SubtaskDTO } from '@/dtos/subtaskDTO'
import { TaskDTO } from '@/dtos/taskDTO'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  StatusBarContainer,
  StatusBarContent,
  OptionsContainer,
  SubtasksContainer,
  SubtasksContent,
} from './styles'

import {
  Content,
  Input,
  InputContainer,
  Label,
  TextArea,
  Title,
  InputVariantsContainer,
  Overlay,
  FormContainer,
  FormError,
} from '../sharedStyles'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'

interface EditTaskProps {
  task: TaskDTO
  onClose: () => void
}

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title is required' }),
  description: z.string().optional(),
  status: z.string().min(3, { message: 'Status is required' }),
})

export type FormData = z.infer<typeof formSchema>

export function EditTask({ task, onClose }: EditTaskProps) {
  useEscapeKeyHandler(onClose)

  const { activeBoard } = useBoardsContext()

  const { editTask, transferTaskToColumn } = useTaskContext()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status,
    },
    resolver: zodResolver(formSchema),
  })

  const [isOptionsContainerOpen, setIsOptionsContainerOpen] = useState(false)
  const [status, setStatus] = useState(task.status)

  const [formSubtasks, setFormSubtasks] = useState<SubtaskDTO[]>(task.subtasks)
  const [subtaskErrors, setSubtaskErrors] = useState<string[]>([])

  function handleStatusChange(newStatus: string) {
    setStatus(newStatus)
    setValue('status', newStatus)
    setIsOptionsContainerOpen(false)
  }

  function handleEditTask(data: FormData) {
    const updatedTask = {
      title: data.title,
      description: data.description || '',
      status: data.status,
      subtasks: formSubtasks,
    }

    const subtaskErrors = formSubtasks.map((subtask) =>
      subtask.title === '' ? 'Required' : '',
    )

    const hasErrors = subtaskErrors.some((error) => error !== '')

    if (hasErrors) {
      setSubtaskErrors(subtaskErrors)
      return
    }

    transferTaskToColumn(task, updatedTask.status, task.status)

    editTask(updatedTask, task)

    onClose()
  }

  function addSubtask() {
    const newSubtask = {
      title: '',
      isCompleted: false,
    }
    setFormSubtasks([...formSubtasks, newSubtask])
  }

  function removeSubtask(indexToRemove: number) {
    const updatedSubtasks = formSubtasks.filter(
      (_, index) => index !== indexToRemove,
    )
    setFormSubtasks(updatedSubtasks)
  }

  function handleSubtaskChange(index: number, newValue: string) {
    const updatedSubtasks = [...formSubtasks]
    updatedSubtasks[index].title = newValue

    const newSubtaskErrors = [...subtaskErrors]

    if (newValue.length === 0) {
      newSubtaskErrors[index] = 'Required'
    } else {
      newSubtaskErrors[index] = ''
    }

    setFormSubtasks(updatedSubtasks)
  }

  const renderSubtaskInput = (subtask: SubtaskDTO, index: number) => {
    return (
      <InputVariantsContainer key={index}>
        <InputVariant
          defaultValue={subtask.title}
          inputClassName={`${subtaskErrors[index] ? 'error' : ''}`}
          onChange={(e) => handleSubtaskChange(index, e.target.value)}
          placeholder="e.g. Make coffee"
          onClick={() => removeSubtask(index)}
        />
        {subtaskErrors[index] && <span>{subtaskErrors[index]}</span>}
      </InputVariantsContainer>
    )
  }

  return (
    <>
      <Overlay onClick={() => onClose()} />
      <Content className="bigger">
        <Title>Edit Task</Title>
        <FormContainer onSubmit={handleSubmit(handleEditTask)}>
          <InputContainer>
            <Label htmlFor="title">Title</Label>
            <Input
              placeholder="e.g. Take coffee break"
              {...register('title')}
            />
            {errors?.title && <FormError>{errors.title.message}</FormError>}
          </InputContainer>

          <InputContainer>
            <Label htmlFor="description">Description</Label>
            <TextArea
              placeholder="e.g. It’s always good to take a break. This 
              15-minute break will recharge the batteries a little."
              {...register('description')}
            />
          </InputContainer>

          <SubtasksContainer>
            <Label>Subtasks</Label>
            <SubtasksContent>
              {formSubtasks.map((subtask, index) =>
                renderSubtaskInput(subtask, index),
              )}
            </SubtasksContent>
            <Button
              type="button"
              title="+ Add New Subtask"
              onClick={addSubtask}
            />
          </SubtasksContainer>

          <StatusBarContainer>
            <Label>Status</Label>
            <StatusBarContent
              className={isOptionsContainerOpen ? 'active' : ''}
              onClick={() => setIsOptionsContainerOpen(!isOptionsContainerOpen)}
            >
              <p>{status}</p>
              {isOptionsContainerOpen ? (
                <FontAwesomeIcon icon={faAngleUp} />
              ) : (
                <FontAwesomeIcon icon={faAngleDown} />
              )}
            </StatusBarContent>
            {isOptionsContainerOpen && (
              <OptionsContainer>
                {activeBoard.columns.map((column) => (
                  <button
                    type="button"
                    key={column.name}
                    onClick={() => handleStatusChange(column.name)}
                  >
                    {column.name}
                  </button>
                ))}
              </OptionsContainer>
            )}
          </StatusBarContainer>

          <Button
            title="Edit Task"
            type="submit"
            variant="secondary"
            disabled={isSubmitting}
          />
        </FormContainer>
      </Content>
    </>
  )
}
