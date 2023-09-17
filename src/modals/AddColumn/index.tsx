import { useContext, useState } from 'react'
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
import { BoardsContext } from '@/contexts/BoardsContext'
import { ColumnDTO } from '@/dtos/columnDTO'

interface AddColumnProps {
  onClose: () => void
}

export function AddColumn({ onClose }: AddColumnProps) {
  const { activeBoard, updateColumnsInBoard } = useContext(BoardsContext)
  const [columns, setColumns] = useState<ColumnDTO[]>(activeBoard.columns)
  const [showColumnError, setShowColumnError] = useState(false)

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
    if (newValue.length > 0) {
      setShowColumnError(false)
    }
    setColumns(updatedColumns)
  }

  const handleAddColumnsToBoard = () => {
    const blankedColumns = columns.filter((column) => column.name === '')

    if (blankedColumns.length > 0) {
      setShowColumnError(true)
      return
    }

    updateColumnsInBoard(columns)
    onClose()
  }

  const renderColumnInput = (column: ColumnDTO, index: number) => {
    return (
      <InputColumnsContainer key={column.name}>
        <InputColumnContent>
          <InputColumn
            type="text"
            defaultValue={column.name}
            className={showColumnError ? 'error' : ''}
            onChange={(e) => handleColumnChange(index, e.target.value)}
          />
          <RemoveColumnButton
            className={column.tasks.length > 0 ? 'disabled' : ''}
            onClick={() => handleRemoveColumn(index)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </RemoveColumnButton>
        </InputColumnContent>
        {showColumnError && <span>Required</span>}
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
