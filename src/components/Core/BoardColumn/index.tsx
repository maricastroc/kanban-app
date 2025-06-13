/* eslint-disable react-hooks/exhaustive-deps */
import { TaskProps } from '@/@types/task'
import { BoardColumnProps } from '@/@types/board-column'
import * as Dialog from '@radix-ui/react-dialog'
import { TaskCard } from '../TaskCard'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import {
  Container,
  EmptyTasksContainer,
  TagContainer,
  TasksContainer,
} from './styles'
import { useEffect, useState } from 'react'
import { ColorPickerModal } from '@/components/Modals/ColorPickerModal'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { getTagColor } from '@/utils/getTagColor'
import { saveColumnColor } from '@/storage/colorConfig'

type ColumnProps = BoardColumnProps & {
  index: number
  column: BoardColumnProps
}

export function BoardColumn({ name, tasks, column, index }: ColumnProps) {
  const { handleEnableScrollFeature } = useBoardsContext()

  const [currentColor, setCurrentColor] = useState(getTagColor(index))

  const [isColorPickerModalOpen, setIsColorPickerModalOpen] = useState(false)

  const renderTasks = () => {
    return tasks.map((task: TaskProps, taskIndex: number) => (
      <Draggable key={String(task.id)} draggableId={String(task.id)} index={taskIndex}>
        {(provided) => (
          <TaskCard column={column} task={task} provided={provided} />
        )}
      </Draggable>
    ))
  }

  useEffect(() => {
    handleEnableScrollFeature(!isColorPickerModalOpen)
  }, [isColorPickerModalOpen])

  useEffect(() => {
    saveColumnColor(index, currentColor)
  }, [currentColor, index])

  return (
    <Container className={`${column?.tasks?.length > 0 ? '' : 'empty'}`}>
      <Dialog.Root
        open={isColorPickerModalOpen}
        onOpenChange={setIsColorPickerModalOpen}
      >
        <Dialog.Trigger asChild>
          <TagContainer>
            <p>{`${name} (${tasks.length})`}</p>
          </TagContainer>
        </Dialog.Trigger>
        <ColorPickerModal
          currentColor={currentColor}
          onChange={(color: string) => setCurrentColor(color)}
          onClose={() => setIsColorPickerModalOpen(false)}
        />
      </Dialog.Root>

      <Droppable droppableId={index.toString()} type="CARD">
        {(provided) => (
          <TasksContainer ref={provided.innerRef} {...provided.droppableProps}>
            {renderTasks()}
            {provided.placeholder}
            {tasks.length === 0 && <EmptyTasksContainer />}
          </TasksContainer>
        )}
      </Droppable>
    </Container>
  )
}
