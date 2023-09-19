import { useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { TaskDTO } from '@/dtos/taskDTO'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

import { Container, OptionsContainer, StatusBarContainer } from './styles'
import { useTaskContext } from '@/contexts/TaskContext'

interface CurrentStatusBarProps {
  task: TaskDTO
}

export function CurrentStatusBar({ task }: CurrentStatusBarProps) {
  const { activeBoard } = useBoardsContext()
  const { transferTaskToColumn } = useTaskContext()

  const [isOptionsContainerOpen, setIsOptionsContainerOpen] = useState(false)

  const [status, setStatus] = useState(task.status)

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
                  transferTaskToColumn(task, column.name, status)
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
