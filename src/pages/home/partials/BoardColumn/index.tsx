/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import * as Dialog from '@radix-ui/react-dialog'
import { BoardColumnProps } from '@/@types/board-column'
import { TaskCard } from '../TaskCard'
import {
  Container,
  EmptyTasksContainer,
  TagContainer,
  TasksContainer,
} from './styles'
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

  useEffect(() => {
    handleEnableScrollFeature(!isColorPickerModalOpen)
  }, [isColorPickerModalOpen])

  useEffect(() => {
    saveColumnColor(index, currentColor)
  }, [currentColor, index])

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
    <Container className={isEmpty ? 'empty' : ''}>
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
            {renderTaskCards()}
            {provided.placeholder}
            {isEmpty && <EmptyTasksContainer />}
          </TasksContainer>
        )}
      </Droppable>
    </Container>
  )
}
