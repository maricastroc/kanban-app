import { TaskProps } from '@/@types/task'
import { useDrag } from 'react-dnd'
import { TaskCardContainer } from './styles'

type TaskCardProps = {
  task: TaskProps
  column_index: number
}

export function TaskCard({ task, column_index }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { ...task, column_index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <TaskCardContainer ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <strong>{task.title}</strong>
      <p>{`${task.subtasks.filter(subtask => subtask.isCompleted).length} of ${task.subtasks.length} subtasks`}</p>
    </TaskCardContainer>
  )
}
