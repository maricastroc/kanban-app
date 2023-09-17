import { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleDown,
  faAngleUp,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import {
  Overlay,
  Description,
  Title,
  Content,
  CloseButton,
  InputContainer,
  FormContainer,
  StatusBarContainer,
  StatusBarContent,
  OptionsContainer,
  RemoveSubtaskButton,
  StatusBarTitle,
  SubtasksContainer,
  SubtasksTitle,
  SubtasksContent,
  FormError,
  SubtaskInputsContainer,
  SubtaskInput,
  SubtaskInputContent,
} from './styles'
import { Button } from '@/components/Button'
import { BoardsContext } from '@/contexts/BoardsContext'
import { SubtaskDTO } from '@/dtos/subtaskDTO'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface AddTaskProps {
  onClose: () => void
}

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title is required' }),
  description: z.string().optional(),
})

export type FormData = z.infer<typeof formSchema>

const initialSubtasks = [
  {
    title: '',
    isCompleted: false,
  },
  {
    title: '',
    isCompleted: false,
  },
]

export function AddTask({ onClose }: AddTaskProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const { activeBoard, addTaskToColumn } = useContext(BoardsContext)
  const [isOptionsContainerOpen, setIsOptionsContainerOpen] = useState(false)
  const [status, setStatus] = useState(activeBoard.columns[0].name)

  const [subtasks, setSubtasks] = useState<SubtaskDTO[]>(initialSubtasks)
  const [showBlankSubtaskError, setShowBlankSubtaskError] = useState(false)

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
    setSubtasks(updatedSubtasks)

    if (newValue.length > 0) {
      setShowBlankSubtaskError(false)
    }
  }

  const validateSubtasks = (): boolean => {
    const blankSubtasks = subtasks.filter((subtask) => subtask.title === '')
    if (blankSubtasks.length > 0) {
      setShowBlankSubtaskError(true)
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

    onClose()
  }

  useEffect(() => {
    setSubtasks(initialSubtasks)
  }, [])

  const renderSubtaskInput = (subtask: SubtaskDTO, index: number) => {
    return (
      <SubtaskInputsContainer key={index}>
        <SubtaskInputContent>
          <SubtaskInput
            defaultValue={subtask.title}
            className={showBlankSubtaskError ? 'error' : ''}
            placeholder="e.g. Make coffee"
            onChange={(e) => handleSubtaskChange(index, e.target.value)}
          />
          <RemoveSubtaskButton
            type="button"
            onClick={() => handleRemoveSubtask(index)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </RemoveSubtaskButton>
        </SubtaskInputContent>
        {showBlankSubtaskError && <span>Required</span>}
      </SubtaskInputsContainer>
    )
  }

  return (
    <>
      <Overlay onClick={() => onClose()} />
      <Content>
        <Title>
          <h3>Add Task</h3>
          <CloseButton onClick={() => onClose()}>
            <FontAwesomeIcon icon={faXmark} />
          </CloseButton>
        </Title>
        <Description>
          <FormContainer onSubmit={handleSubmit(handleAddTask)}>
            <InputContainer>
              <label htmlFor="title">Title</label>
              <input
                placeholder="e.g. Take coffee break"
                {...register('title')}
              />
              {errors?.title && <FormError>{errors.title.message}</FormError>}
            </InputContainer>

            <InputContainer>
              <label htmlFor="description">Description</label>
              <textarea
                placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
                {...register('description')}
              />
            </InputContainer>

            <SubtasksContainer>
              <SubtasksTitle>Subtasks</SubtasksTitle>
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
              <StatusBarTitle>Status</StatusBarTitle>
              <StatusBarContent
                className={isOptionsContainerOpen ? 'active' : ''}
                onClick={() =>
                  setIsOptionsContainerOpen(!isOptionsContainerOpen)
                }
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
        </Description>
      </Content>
    </>
  )
}
