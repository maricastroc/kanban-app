import { useState } from 'react'
import { TaskProps } from '@/@types/task'
import { BoardColumnProps } from '@/@types/board-column'

export function useDragAndDropTask(
  initialColumns: BoardColumnProps[],
  moveTaskToColumn: (
    task: TaskProps,
    newColumnName: string,
    previousColumnName: string,
  ) => void,
) {
  const [columns, setColumns] = useState<BoardColumnProps[]>(initialColumns)

  const handleDragAndDropTask = (
    task: TaskProps,
    previousName: string,
    name: string,
    newColumnIndex: number,
  ) => {
    const columnIndex = task.column_index

    if (columnIndex !== undefined) {
      setColumns((prevColumns) => {
        const sourceColumn = prevColumns[columnIndex]
        const targetColumn = prevColumns[newColumnIndex]

        const updatedSourceColumnTasks = sourceColumn.tasks.filter(
          (t) => t.title !== task.title,
        )

        const updatedTargetColumnTasks = [...targetColumn.tasks, task]

        const updatedColumns = prevColumns.map((column, index) => {
          if (index === columnIndex) {
            return { ...column, tasks: updatedSourceColumnTasks }
          } else if (index === newColumnIndex) {
            return { ...column, tasks: updatedTargetColumnTasks }
          }
          return column
        })

        moveTaskToColumn(task, name, previousName)

        return updatedColumns
      })
    }
  }

  return { columns, handleDragAndDropTask, setColumns }
}
