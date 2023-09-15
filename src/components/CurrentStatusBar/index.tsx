import { useContext, useState } from 'react'
import { BoardsContext } from '../../contexts/BoardsContext'
import { saveStorageBoards } from '../../storage/boardsConfig'
import { TaskDTO } from '../../dtos/taskDTO'
import { ColumnDTO } from '../../dtos/columnDTO'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

import { Container, OptionsContainer, StatusBarContainer } from './styles'

interface CurrentStatusBarProps {
  currentStatus: string
  task: TaskDTO
}

export function CurrentStatusBar({
  currentStatus,
  task,
}: CurrentStatusBarProps) {
  const { activeBoard, allBoards, handleSetAllBoards, handleSetActiveBoard } =
    useContext(BoardsContext)

  const [isOptionsContainerOpen, setIsOptionsContainerOpen] = useState(false)

  const [status, setStatus] = useState(currentStatus)

  function transferTaskToColumn(
    selectedTask: TaskDTO,
    destinationColumnName: string,
  ) {
    const updatedBoards = [...allBoards]
    const activeBoardIndex = updatedBoards.findIndex(
      (board) => board.name === activeBoard.name,
    )

    if (activeBoardIndex !== -1) {
      const activeBoardCopy = { ...updatedBoards[activeBoardIndex] }

      const sourceColumnIndex = activeBoardCopy.columns.findIndex(
        (column: ColumnDTO) => column.name === status,
      )

      if (sourceColumnIndex !== -1) {
        const sourceColumn = activeBoardCopy.columns[sourceColumnIndex]
        const taskIndex = sourceColumn.tasks.findIndex(
          (task: TaskDTO) => task.title === selectedTask.title,
        )

        if (taskIndex !== -1) {
          const sourceTask = sourceColumn.tasks[taskIndex]

          sourceTask.status = destinationColumnName

          console.log('hey')

          sourceColumn.tasks.splice(taskIndex, 1)

          const destinationColumnIndex = activeBoardCopy.columns.findIndex(
            (column: ColumnDTO) => column.name === destinationColumnName,
          )

          if (destinationColumnIndex !== -1) {
            const destinationColumn =
              activeBoardCopy.columns[destinationColumnIndex]
            destinationColumn.tasks.push(selectedTask)
            updatedBoards[activeBoardIndex] = activeBoardCopy

            handleSetAllBoards(updatedBoards)
            handleSetActiveBoard(activeBoardCopy)
            saveStorageBoards(updatedBoards)
          }
        }
      }
    }
  }

  return (
    <Container>
      <StatusBarContainer
        className={isOptionsContainerOpen ? 'active' : ''}
        onClick={() => setIsOptionsContainerOpen(!isOptionsContainerOpen)}
      >
        <p>{status}</p>
        {isOptionsContainerOpen ? (
          <FontAwesomeIcon icon={faAngleUp} />
        ) : (
          <FontAwesomeIcon icon={faAngleDown} />
        )}
      </StatusBarContainer>
      {isOptionsContainerOpen && (
        <OptionsContainer>
          {activeBoard.columns.map((column) => {
            return (
              <button
                key={column.name}
                onClick={() => {
                  setStatus(column.name)
                  transferTaskToColumn(task, column.name)
                  setIsOptionsContainerOpen(false)
                }}
              >
                {column.name}
              </button>
            )
          })}
        </OptionsContainer>
      )}
    </Container>
  )
}
