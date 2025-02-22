/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { getColumnColor, saveColumnColor } from '@/storage/colorConfig'
import { KeyedMutator } from 'swr'
import { AxiosResponse } from 'axios'
import { BoardProps } from '@/@types/board'

type ColumnProps = BoardColumnProps & {
  index: number
  column: BoardColumnProps
  mutate: KeyedMutator<AxiosResponse<BoardProps, any>>
  activeBoard: BoardProps
}

export function BoardColumn({ name, id, tasks, mutate, activeBoard, column, index }: ColumnProps) {
  const { handleEnableScrollFeature } = useBoardsContext()

  const [currentColor, setCurrentColor] = useState(
    getColumnColor(index) || getTagColor(index),
  )

  const [isColorPickerModalOpen, setIsColorPickerModalOpen] = useState(false)

  const renderTasks = () => {
    return tasks.map((task: TaskProps, taskIndex: number) => (
      <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
        {(provided) => <TaskCard column={column} activeBoard={activeBoard} boardId={id} mutate={mutate} task={task} provided={provided} />}
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
