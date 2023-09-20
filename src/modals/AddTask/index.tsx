import { useEffect, useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useTaskContext } from '@/contexts/TaskContext'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

import { Button } from '@/components/Button'
import { InputVariant } from '@/components/InputVariant'
import { SubtaskDTO } from '@/dtos/subtaskDTO'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'
import { initialSubtasks } from '@/utils/initialValues'

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
  FormContainer,
  FormError,
  Input,
  InputContainer,
  InputVariantsContainer,
  Label,
  Overlay,
  TextArea,
  Title,
} from '../sharedStyles'

interface AddTaskProps {
  onClose: () => void
}

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title is required' }),
  description: z.string().optional(),
})

export type FormData = z.infer<typeof formSchema>

export function AddTask({ onClose }: AddTaskProps) {
  useEscapeKeyHandler(onClose)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const { activeBoard } = useBoardsContext()

  const { addTaskToColumn } = useTaskContext()

  const [isOptionsContainerOpen, setIsOptionsContainerOpen] = useState(false)

  const [status, setStatus] = useState(activeBoard.columns[0].name)

  const [subtasks, setSubtasks] = useState<SubtaskDTO[]>(initialSubtasks)

  const [subtaskErrors, setSubtaskErrors] = useState<string[]>([])

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
  }

  const handleAddSubtask = () => {
    const newSubtask = {
      title: '',
      isCompleted: false,
    }
    setSubtasks([...subtasks, newSubtask])
  }

  const handleRemoveSubtask = (indexToRemove: number) => {
    const updatedSubtasks = subtasks.filter(
      (_, index) => index !== indexToRemove,
    )
    setSubtasks(updatedSubtasks)
  }

  const handleSubtaskChange = (index: number, newValue: string) => {
    const updatedSubtasks = [...subtasks]
    updatedSubtasks[index].title = newValue

    const newSubtaskErrors = [...subtaskErrors]

    if (newValue.length === 0) {
      newSubtaskErrors[index] = 'Required'
    } else {
      newSubtaskErrors[index] = ''
    }

    setSubtasks(updatedSubtasks)
  }

  const validateSubtasks = (): boolean => {
    const subtaskErrors = subtasks.map((subtask) =>
      subtask.title === '' ? 'Required' : '',
    )

    const hasErrors = subtaskErrors.some((error) => error !== '')

    if (hasErrors) {
      setSubtaskErrors(subtaskErrors)
      return false
    }

    return true
  }

  const handleAddTask = (data: FormData) => {
    if (!validateSubtasks()) {
      return
    }

    const newTask = {
      title: data.title,
      description: data?.description || '',
      status,
      subtasks,
    }

    addTaskToColumn(newTask, status)

    setSubtasks([
      {
        title: '',
        isCompleted: false,
      },
      {
        title: '',
        isCompleted: false,
      },
    ])

    onClose()
  }

  useEffect(() => {
    setSubtasks([
      {
        title: '',
        isCompleted: false,
      },
      {
        title: '',
        isCompleted: false,
      },
    ])
  }, [])

  const renderSubtaskInput = (subtask: SubtaskDTO, index: number) => {
    return (
      <InputVariantsContainer key={subtask.title}>
        <InputVariant
          inputClassName={`${subtaskErrors[index] ? 'error' : ''}`}
          placeholder="e.g. Make coffee"
          defaultValue={''}
          onChange={(e) => handleSubtaskChange(index, e.target.value)}
          onClick={() => handleRemoveSubtask(index)}
        />
        {subtaskErrors[index] && <span>{subtaskErrors[index]}</span>}
      </InputVariantsContainer>
    )
  }

  console.log(subtasks)

  return (
    <>
      <Overlay onClick={() => onClose()} />
      <Content className="bigger">
        <Title>Add Task</Title>
        <FormContainer onSubmit={handleSubmit(handleAddTask)}>
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
              placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
              {...register('description')}
            />
          </InputContainer>

          <SubtasksContainer>
            <Label>Subtasks</Label>
            <SubtasksContent>
              {subtasks.map((subtask, index) =>
                renderSubtaskInput(subtask, index),
              )}
            </SubtasksContent>
            <Button
              type="button"
              title="+ Add New Subtask"
              onClick={handleAddSubtask}
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
            title="Create Task"
            type="submit"
            variant="secondary"
            disabled={isSubmitting}
          />
        </FormContainer>
      </Content>
    </>
  )
}
