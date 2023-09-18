import { useContext, useState } from 'react'

import { Button } from '@/components/Button'
import { BoardsContext } from '@/contexts/BoardsContext'
import { SubtaskDTO } from '@/dtos/subtaskDTO'
import { TaskDTO } from '@/dtos/taskDTO'

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
  const { activeBoard, editTask } = useContext(BoardsContext)

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
  const [showSubtaskError, setShowSubtaskError] = useState(false)

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

    editTask(updatedTask, task, task.status)

    onClose()
  }

  function addSubtask() {
    const newSubtask = {
      title: '',
      isCompleted: false,
    }
    setFormSubtasks([...formSubtasks, newSubtask])
    setShowSubtaskError(false)
  }

  function removeSubtask(indexToRemove: number) {
    if (formSubtasks.length === 1) {
      setShowSubtaskError(true)
      return
    }

    setShowSubtaskError(false)

    const updatedSubtasks = formSubtasks.filter(
      (_, index) => index !== indexToRemove,
    )
    setFormSubtasks(updatedSubtasks)
  }

  function handleSubtaskChange(index: number, newValue: string) {
    const updatedSubtasks = [...formSubtasks]
    updatedSubtasks[index].title = newValue
    setFormSubtasks(updatedSubtasks)
  }

  return (
    <>
      <Overlay onClick={() => onClose()} />
      <Content>
        <Title>
          <h3>Edit Task</h3>
          <CloseButton onClick={() => onClose()}>
            <FontAwesomeIcon icon={faXmark} />
          </CloseButton>
        </Title>
        <Description className="DialogDescription">
          <FormContainer onSubmit={handleSubmit(handleEditTask)}>
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
                placeholder="e.g. It’s always good to take a break. This 
                15-minute break will recharge the batteries a little."
                {...register('description')}
              />
            </InputContainer>

            <SubtasksContainer>
              <SubtasksTitle>Subtasks</SubtasksTitle>
              <SubtasksContent>
                {formSubtasks.map((subtask, index) => (
                  <SubtaskInputContainer key={index}>
                    <input
                      defaultValue={subtask.title}
                      onChange={(e) =>
                        handleSubtaskChange(index, e.target.value)
                      }
                    />
                    <button type="button" onClick={() => removeSubtask(index)}>
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </SubtaskInputContainer>
                ))}
              </SubtasksContent>
              <Button
                type="button"
                title="+ Add New Subtask"
                onClick={addSubtask}
              />
              {showSubtaskError && (
                <FormError>
                  You&aposve got to keep at least one subtask
                </FormError>
              )}
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
              title="Edit Task"
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
