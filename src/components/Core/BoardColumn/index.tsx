import { TaskProps } from '@/@types/task'
import { BoardColumnProps } from '@/@types/board-column'
import * as Dialog from '@radix-ui/react-dialog'
import { TaskCard } from '../TaskCard'
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd'

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
import { getColumnColor, saveColumnColor } from '@/storage/colorConfig'
import { useTaskContext } from '@/contexts/TasksContext'

type ColumnProps = BoardColumnProps & {
  index: number
}

export function BoardColumn({ name, tasks, index }: ColumnProps) {
  const { handleEnableScrollFeature } = useBoardsContext()

  const { reorderTasksInColumn } = useTaskContext();

  const [currentColor, setCurrentColor] = useState(
    getColumnColor(index) || getTagColor(index),
  )

  const [isColorPickerModalOpen, setIsColorPickerModalOpen] = useState(false)

  const renderTasks = () => {
    return tasks.map((task: TaskProps, taskIndex: number) => (
      <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
        {(provided) => <TaskCard task={task} provided={provided} />}
      </Draggable>
    ))
  }

  const handleDragEnd = (result: any) => {
    const { destination, source } = result

    if (!destination || (destination.index === source.index && destination.droppableId === source.droppableId)) {
      return // Não fez movimento ou movimento na mesma posição
    }
  
    console.log('Source:', source, 'Destination:', destination)
  
    // Reordenar as tarefas na coluna
    const newTasks = Array.from(tasks) // Faz uma cópia do array de tarefas
    const [removed] = newTasks.splice(source.index, 1) // Remove a tarefa da posição original
    newTasks.splice(destination.index, 0, removed) // Insere a tarefa na nova posição
  
    reorderTasksInColumn(name, newTasks) 
  }

  useEffect(() => {
    handleEnableScrollFeature(!isColorPickerModalOpen)
  }, [isColorPickerModalOpen])

  useEffect(() => {
    saveColumnColor(index, currentColor)
  }, [currentColor, index])

  return (
    <Container>
      <Dialog.Root
        open={isColorPickerModalOpen}
        onOpenChange={setIsColorPickerModalOpen}
      >
        <Dialog.Trigger asChild>
          <TagContainer>
            <button
              style={{ backgroundColor: currentColor }}
              onClick={() => setIsColorPickerModalOpen(!isColorPickerModalOpen)}
            />
            <p>{`${name} (${tasks.length})`}</p>
          </TagContainer>
        </Dialog.Trigger>
        <ColorPickerModal
          currentColor={currentColor}
          onChange={(color: string) => setCurrentColor(color)}
          onClose={() => setIsColorPickerModalOpen(false)}
        />
      </Dialog.Root>

      <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={index.toString()} type="CARD">
        {(provided) => (
          <TasksContainer ref={provided.innerRef} {...provided.droppableProps}>
            {renderTasks()}
            {provided.placeholder}
            {tasks.length === 0 && <EmptyTasksContainer />}
          </TasksContainer>
        )}
      </Droppable>
      </DragDropContext>
    </Container>
  )
}
