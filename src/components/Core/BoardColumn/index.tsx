import { TaskProps } from '@/@types/task';
import { BoardColumnProps } from '@/@types/board-column';
import { TaskCard } from '../TaskCard';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import {
  Container,
  EmptyTasksContainer,
  TagContainer,
  TasksContainer,
} from './styles';

type ColumnProps = BoardColumnProps & {
  index: number;
};

export function BoardColumn({
  name,
  tasks,
  index,
}: ColumnProps) {
  const variant = `${index + 1}` as '1' | '2' | '3' | '4' | '5' | '6';

  const renderTasks = () => {
    return tasks.map((task: TaskProps, taskIndex: number) => (
      <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
        {(provided) => (
          <TaskCard task={task} provided={provided} />
        )}
      </Draggable>
    ));
  };

  return (
    <Container>
      <TagContainer variant={variant}>
        <span />
        <p>{`${name} (${tasks.length})`}</p>
      </TagContainer>

      <Droppable droppableId={index.toString()} type="CARD">
        {(provided) => (
          <TasksContainer ref={provided.innerRef} {...provided.droppableProps}>
            {renderTasks()}
            {provided.placeholder}
            {tasks.length === 0 && (
              <EmptyTasksContainer />
            )}
          </TasksContainer>
        )}
      </Droppable>
    </Container>
  );
}
