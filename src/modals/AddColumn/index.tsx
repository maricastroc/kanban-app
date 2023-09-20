import { useState } from 'react'

import { ColumnsContainer, ColumnsContent } from './styles'

import {
  Content,
  FormContainer,
  Input,
  InputContainer,
  InputVariantsContainer,
  Label,
  Overlay,
  Title,
} from '../sharedStyles'

import { Button } from '@/components/Button'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useTaskContext } from '@/contexts/TaskContext'
import { ColumnDTO } from '@/dtos/columnDTO'
import { InputVariant } from '@/components/InputVariant'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'

interface AddColumnProps {
  onClose: () => void
}

export function AddColumn({ onClose }: AddColumnProps) {
  useEscapeKeyHandler(onClose)

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
      <InputVariantsContainer key={columnKey}>
        <InputVariant
          inputClassName={`${column.tasks.length > 0 ? 'disabled' : ''} ${
            columnErrors[index] ? 'error' : ''
          }`}
          btnClassName={column.tasks.length > 0 ? 'disabled' : ''}
          defaultValue={column.name}
          placeholder=""
          onChange={(e) => handleColumnChange(index, e.target.value)}
          onClick={() => handleRemoveColumn(index)}
        />
        {columnErrors[index] && <span>{columnErrors[index]}</span>}
      </InputVariantsContainer>
    )
  }

  return (
    <>
      <Overlay onClick={() => onClose()} />
      <Content className="bigger">
        <Title>Add New Column</Title>
        <FormContainer>
          <InputContainer>
            <Label>Name</Label>
            <Input className="disabled" type="text" value={activeBoard.name} />
          </InputContainer>
          <ColumnsContainer>
            <Label>Columns</Label>
            <ColumnsContent>
              {columns.map((column, index) => renderColumnInput(column, index))}
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
      </Content>
    </>
  )
}
