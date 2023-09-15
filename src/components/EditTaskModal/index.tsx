import { useContext, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { BoardsContext } from '../../contexts/BoardsContext'
import { getStorageBoards, saveStorageBoards } from '../../storage/boardsConfig'
import { ColumnDTO } from '../../dtos/columnDTO'
import { SubtaskDTO } from '../../dtos/subtaskDTO'
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
  AddSubtaskButton,
  EditTaskButton,
  FormError,
} from './styles'

interface EditTaskModalProps {
  task: TaskDTO
  onClose: () => void
}

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title is required' }),
  description: z.string().optional(),
  status: z.string().min(3, { message: 'Status is required' }),
})

export type FormData = z.infer<typeof formSchema>

export function EditTaskModal({ task, onClose }: EditTaskModalProps) {
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

  const { activeBoard, handleSetActiveBoard, handleSetAllBoards } =
    useContext(BoardsContext)

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
    const boardsCopy = [...getStorageBoards()]
    const boardIndex = boardsCopy.findIndex(
      (board) => board.name === activeBoard.name,
    )

    if (boardIndex !== -1) {
      const updatedBoard = { ...boardsCopy[boardIndex] }

      const targetTaskIndex = updatedBoard.columns.findIndex(
        (column: ColumnDTO) => column.tasks.some((t) => t.title === task.title),
      )

      if (targetTaskIndex !== -1) {
        const targetTask = updatedBoard.columns[targetTaskIndex].tasks.find(
          (t: TaskDTO) => t.title === task.title,
        )

        if (targetTask) {
          targetTask.title = data.title
          targetTask.description = data.description
          targetTask.status = data.status
          targetTask.subtasks = formSubtasks

          boardsCopy[boardIndex] = updatedBoard

          handleSetActiveBoard(updatedBoard)

          handleSetAllBoards(boardsCopy)

          saveStorageBoards(boardsCopy)
        }
      }
    }

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
    <Dialog.Portal>
      <Overlay className="DialogOverlay" />
      <Content className="DialogContent">
        <Title className="DialogTitle">
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
                15 minute break will  recharge the batteries 
                a little."
                {...register('description')}
              />
            </InputContainer>

            <SubtasksContainer>
              <SubtasksTitle>Subtasks</SubtasksTitle>
              <SubtasksContent>
                {formSubtasks.map((subtask, index) => {
                  return (
                    <SubtaskInputContainer key={index}>
                      <input
                        defaultValue={subtask.title}
                        onChange={(e) =>
                          handleSubtaskChange(index, e.target.value)
                        }
                      />
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
              <AddSubtaskButton type="button" onClick={addSubtask}>
                + Add New Subtask
              </AddSubtaskButton>
              {showSubtaskError && (
                <FormError>
                  You&apos;ve got to keep at least one subtask
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

            <EditTaskButton type="submit" disabled={isSubmitting}>
              Edit Task
            </EditTaskButton>
          </FormContainer>
        </Description>
      </Content>
    </Dialog.Portal>
  )
}
