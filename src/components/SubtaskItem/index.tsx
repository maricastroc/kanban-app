import { useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { getStorageBoards } from '@/storage/boardsConfig'
import { ColumnDTO } from '@/dtos/columnDTO'
import { TaskDTO } from '@/dtos/taskDTO'
import { SubtaskDTO } from '@/dtos/subtaskDTO'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

import { CheckedBox, Container, Title, UncheckedBox } from './styles'

interface SubtaskItemProps {
  task: TaskDTO
  title: string
  isCompleted: boolean
}

export function SubtaskItem({ task, title, isCompleted }: SubtaskItemProps) {
  const { activeBoard, updateActiveBoard, updateBoards } = useBoardsContext()

  const [isChecked, setIsChecked] = useState(isCompleted)

  const toggleSubtaskCompletion = (task: TaskDTO, subtaskTitle: string) => {
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
          const targetSubtask = targetTask.subtasks.find(
            (subtask: SubtaskDTO) => subtask.title === subtaskTitle,
          )

          if (targetSubtask) {
            targetSubtask.isCompleted = !isChecked

            boardsCopy[boardIndex] = updatedBoard

            setIsChecked(!isChecked)

            updateActiveBoard(updatedBoard)
            updateBoards(boardsCopy)
          }
        }
      }
    }
  }

  return (
    <Container>
      {isChecked ? (
        <CheckedBox onClick={() => toggleSubtaskCompletion(task, title)}>
          <FontAwesomeIcon icon={faCheck} />
        </CheckedBox>
      ) : (
        <UncheckedBox onClick={() => toggleSubtaskCompletion(task, title)} />
      )}
      <Title className={isChecked ? 'checked' : 'unchecked'}>{title}</Title>
    </Container>
  )
}
