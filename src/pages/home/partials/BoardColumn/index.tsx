import { Droppable, Draggable } from 'react-beautiful-dnd'
import { BoardColumnProps } from '@/@types/board-column'
import { TaskCard } from '../TaskCard'
import {
  Container,
  EmptyTasksContainer,
  TagContainer,
  TasksContainer,
} from './styles'
import { ProfilerWrapper } from '@/components/Shared/ProfilerWrapper'

type ColumnProps = BoardColumnProps & {
  index: number
  column: BoardColumnProps
}

export function BoardColumn({ name, tasks, column, index }: ColumnProps) {
  const renderTaskCards = () =>
    tasks.map((task, taskIndex) => (
      <Draggable
        key={String(task.id)}
        draggableId={String(task.id)}
        index={taskIndex}
      >
        {(provided) => (
          <TaskCard column={column} task={task} provided={provided} />
        )}
      </Draggable>
    ))

  const isEmpty = column?.tasks?.length === 0

  return (
    <ProfilerWrapper id={`BoardColumn-${index}`}>
      <Container className={isEmpty ? 'empty' : ''}>
        <TagContainer>
          <p>{`${name} (${tasks.length})`}</p>
        </TagContainer>

        <Droppable droppableId={index.toString()} type="CARD">
          {(provided) => (
            <TasksContainer ref={provided.innerRef} {...provided.droppableProps}>
              {renderTaskCards()}
              {provided.placeholder}
              {isEmpty && <EmptyTasksContainer />}
            </TasksContainer>
          )}
        </Droppable>
      </Container>
    </ProfilerWrapper>
  )
}

if (process.env.NODE_ENV === 'development') {
  BoardColumn.whyDidYouRender = true
}
