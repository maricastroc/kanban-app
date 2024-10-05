import { useState } from 'react'
import { TaskProps } from '@/@types/task'
import { BoardColumnProps } from '@/@types/board-column'
import { useDrop } from 'react-dnd'
import { TaskCard } from '../TaskCard'

import {
  Container,
  EmptyTasksContainer,
  TagContainer,
  TasksContainer,
} from './styles'

type ColumnProps = BoardColumnProps & {
  index: number,
  handleDragAndDropTask: (
    task: TaskProps, 
    targetColumn: string, 
    targetIndex: number,
  ) => void
}

export function BoardColumn({ name, tasks, index, handleDragAndDropTask }: ColumnProps) {
  const variant = `${index + 1}` as '1' | '2' | '3' | '4' | '5' | '6'

  const [previousColumn, setPreviousColumn] = useState<string | null>(null)

  const [{ isOver }, drop] = useDrop({
    accept: 'CARD',
    drop: (item: TaskProps) => {

      if (previousColumn) {
        handleDragAndDropTask(item, name, index)
      }
      setPreviousColumn(null)
    },
    hover: (item: TaskProps) => {
      if (!previousColumn) {
        setPreviousColumn(item.status)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  const renderTasks = () => {
    return tasks.map((task: TaskProps) => {
      return (
        <TaskCard
          key={task.title}
          task={task}
          column_index={index}
        />
      )
    })
  }

  return (
    <Container ref={drop}>
      <TagContainer variant={variant}>
        <span />
        <p>{`${name} (${tasks.length})`}</p>
      </TagContainer>

      {tasks.length > 0 ? (
        <TasksContainer style={{ 
          backgroundColor: isOver ? 'rgba(0, 0, 0, 0.05)' : 'inherit',
          transition: 'border 0.3s ease'
        }}>{renderTasks()}</TasksContainer>
      ) : (
        <EmptyTasksContainer />
      )}
    </Container>
  )
}
