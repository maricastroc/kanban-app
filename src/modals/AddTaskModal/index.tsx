import { useContext, useEffect, useState } from 'react'
import { BoardsContext } from '@/contexts/BoardsContext'
import { SubtaskDTO } from '@/dtos/subtaskDTO'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleDown,
  faAngleUp,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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
  StatusBarTitle,
  SubtasksContainer,
  SubtasksTitle,
  SubtasksContent,
  SubtaskInputContainer,
  FormError,
} from './styles'
import { Button } from '@/components/Button'

interface AddTaskModalProps {
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

export function AddTaskModal({ onClose }: AddTaskModalProps) {
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

  const [formSubtasks, setFormSubtasks] =
    useState<SubtaskDTO[]>(initialSubtasks)

  const [showBlankSubtaskError, setShowBlankSubtaskError] = useState(false)

  function handleStatusChange(newStatus: string) {
    setStatus(newStatus)
  }

  function handleAddTask(data: FormData) {
    const blankSubtasks = formSubtasks.filter((subtask) => subtask.title === '')

    if (blankSubtasks.length > 0) {
      setShowBlankSubtaskError(true)
      return
    }

    const newTask = {
      title: data.title,
      description: data?.description || '',
      status,
      subtasks: formSubtasks,
    }

    addTaskToColumn(newTask, status)

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
    setFormSubtasks(updatedSubtasks)

    if (newValue.length > 0) {
      setShowBlankSubtaskError(false)
    }
  }

  useEffect(() => {
    setFormSubtasks(initialSubtasks)
  }, [])

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
                placeholder="e.g. It’s always good to take a break. This 15 minute break will  recharge the batteries a little."
                {...register('description')}
              />
            </InputContainer>

            <SubtasksContainer>
              <SubtasksTitle>Subtasks</SubtasksTitle>
              <SubtasksContent>
                {formSubtasks.map((_, index) => {
                  return (
                    <SubtaskInputContainer key={index}>
                      <input
                        defaultValue={''}
                        className={showBlankSubtaskError ? 'error' : ''}
                        placeholder="e.g. Make coffee"
                        onChange={(e) =>
                          handleSubtaskChange(index, e.target.value)
                        }
                      />
                      {showBlankSubtaskError && <span>Required</span>}
                      <button
                        type="button"
                        onClick={() => removeSubtask(index)}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </SubtaskInputContainer>
                  )
                })}
              </SubtasksContent>
              <Button
                type="button"
                title="+ Add New Subtask"
                onClick={addSubtask}
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
                  {activeBoard.columns.map((column) => {
                    return (
                      <button
                        type="button"
                        key={column.name}
                        onClick={() => handleStatusChange(column.name)}
                      >
                        {column.name}
                      </button>
                    )
                  })}
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
