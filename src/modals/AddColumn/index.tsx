import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import {
  Overlay,
  Description,
  Title,
  Content,
  FormContainer,
  RemoveColumnButton,
  ColumnsContainer,
  ColumnsContent,
  Label,
  InputColumn,
  InputColumnsContainer,
  InputNameContainer,
  InputColumnContent,
} from './styles'

import { Button } from '@/components/Button'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useTaskContext } from '@/contexts/TaskContext'
import { ColumnDTO } from '@/dtos/columnDTO'

interface AddColumnProps {
  onClose: () => void
}

export function AddColumn({ onClose }: AddColumnProps) {
  const { activeBoard } = useBoardsContext()

  const { updateColumnsInBoard } = useTaskContext()

  const [columns, setColumns] = useState<ColumnDTO[]>(activeBoard.columns)

  const [columnErrors, setColumnErrors] = useState<string[]>([])

  const handleAddColumn = () => {
    const newColumn = {
      name: '',
      tasks: [],
    }
    setColumns([...columns, newColumn])
  }

  const handleRemoveColumn = (indexToRemove: number) => {
    const updatedColumns = columns.filter((_, index) => index !== indexToRemove)
    setColumns(updatedColumns)
  }

  const handleColumnChange = (index: number, newValue: string) => {
    const updatedColumns = [...columns]
    updatedColumns[index].name = newValue

    const newColumnErrors = [...columnErrors]
    if (newValue.length === 0) {
      newColumnErrors[index] = 'Required'
    } else {
      newColumnErrors[index] = ''
    }

    setColumns(updatedColumns)
  }

  const handleAddColumnsToBoard = () => {
    const columnErrors = columns.map((column) =>
      column.name === '' ? 'Required' : '',
    )

    const hasErrors = columnErrors.some((error) => error !== '')

    if (hasErrors) {
      setColumnErrors(columnErrors)
      return
    }

    updateColumnsInBoard(columns)
    onClose()
  }

  const renderColumnInput = (column: ColumnDTO, index: number) => {
    const columnKey = `column-${index}`

    return (
      <InputColumnsContainer key={columnKey}>
        <InputColumnContent>
          <InputColumn
            type="text"
            defaultValue={column.name}
            className={`${column.tasks.length > 0 ? 'disabled' : ''} ${
              columnErrors[index] ? 'error' : ''
            }`}
            onChange={(e) => handleColumnChange(index, e.target.value)}
          />
          <RemoveColumnButton
            className={column.tasks.length > 0 ? 'disabled' : ''}
            onClick={() => handleRemoveColumn(index)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </RemoveColumnButton>
        </InputColumnContent>
        {columnErrors[index] && <span>{columnErrors[index]}</span>}
      </InputColumnsContainer>
    )
  }

  return (
    <>
      <Overlay onClick={() => onClose()} />
      <Content>
        <Title>
          <h3>Add New Column</h3>
        </Title>
        <Description>
          <FormContainer>
            <InputNameContainer>
              <Label>Name</Label>
              <input type="text" value={activeBoard.name} />
            </InputNameContainer>
            <ColumnsContainer>
              <Label>Columns</Label>
              <ColumnsContent>
                {columns.map((column, index) =>
                  renderColumnInput(column, index),
                )}
              </ColumnsContent>
              {columns.length !== 6 && (
                <Button
                  type="button"
                  title="+ Add New Column"
                  onClick={handleAddColumn}
                />
              )}
            </ColumnsContainer>
            <Button
              title="Save Changes"
              variant="secondary"
              onClick={handleAddColumnsToBoard}
            />
          </FormContainer>
        </Description>
      </Content>
    </>
  )
}
