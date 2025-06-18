import { SubtaskProps } from '@/@types/subtask'
import { EmptySubtask, SubtasksContainer } from './styles'
import { SubtaskItem } from '@/components/Core/SubtaskItem'
import { Reorder } from 'framer-motion'
import toast from 'react-hot-toast'

interface Props {
  taskId: string | number | undefined
  subtasks?: SubtaskProps[]
  isReordering: boolean
  handleSetIsLoading: (value: boolean) => void
  handleSetSubtasks: (value: SubtaskProps[]) => void
  reorderSubtaskInTask: (taskId: string, newOrder: SubtaskProps[]) => void
}

export const SubtasksSection = ({
  isReordering,
  taskId,
  subtasks,
  handleSetIsLoading,
  handleSetSubtasks,
  reorderSubtaskInTask,
}: Props) => {
  return subtasks && subtasks?.length > 0 ? (
    <SubtasksContainer>
      <Reorder.Group
        axis="y"
        values={subtasks}
        onReorder={(newOrder) => {
          if (isReordering) {
            toast.error('Please wait until the current request is completed.')
            return
          }

          handleSetSubtasks(newOrder)
          reorderSubtaskInTask(taskId as string, newOrder)
        }}
      >
        {subtasks.map((subtask: SubtaskProps) => (
          <Reorder.Item
            as="div"
            key={subtask.id}
            value={subtask}
            style={{ cursor: 'grab' }}
            whileDrag={{ cursor: 'grabbing' }}
          >
            <SubtaskItem
              id={subtask.id}
              name={subtask.name}
              isCompleted={subtask.is_completed}
              handleSetIsLoading={(value: boolean) => handleSetIsLoading(value)}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </SubtasksContainer>
  ) : (
    <EmptySubtask>No subtasks.</EmptySubtask>
  )
}
