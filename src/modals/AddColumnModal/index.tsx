import { useContext, useState } from 'react'
import { BoardsContext } from '@/contexts/BoardsContext'

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
} from './styles'
import { Button } from '@/components/Button'
import { ColumnDTO } from '@/dtos/columnDTO'

interface AddColumnModalProps {
  onClose: () => void
}

export function AddColumnModal({ onClose }: AddColumnModalProps) {
  const { activeBoard, updateColumnsInBoard } = useContext(BoardsContext)

  const [columns, setColumns] = useState<ColumnDTO[]>(activeBoard.columns)

  const [showColumnError, setShowColumnError] = useState(false)

  function handleAddColumn() {
    const newColumn = {
      name: '',
      tasks: [],
    }
    setColumns([...columns, newColumn])
  }

  function handleRemoveColumn(indexToRemove: number) {
    const updatedColumns = columns.filter((_, index) => index !== indexToRemove)
    setColumns(updatedColumns)
  }

  function handleColumnChange(index: number, newValue: string) {
    const updatedColumns = [...columns]

    updatedColumns[index].name = newValue

    if (newValue.length > 0) {
      setShowColumnError(false)
    }
  }

  function handleAddColumnsToBoard() {
    const blankedColumns = columns.filter((column) => column.name === '')

    if (blankedColumns.length > 0) {
      setShowColumnError(true)
      return
    }

    updateColumnsInBoard(columns)
    onClose()
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
                {columns.map((column, index) => {
                  return (
                    <InputColumnsContainer key={column.name}>
                      <InputColumn
                        type="text"
                        defaultValue={column.name}
                        className={showColumnError ? 'error' : ''}
                        onChange={(e) =>
                          handleColumnChange(index, e.target.value)
                        }
                      />
                      {showColumnError && <span>Required</span>}
                      <RemoveColumnButton
                        className={column.tasks.length > 0 ? 'disabled' : ''}
                        onClick={() => {
                          handleRemoveColumn(index)
                        }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </RemoveColumnButton>
                    </InputColumnsContainer>
                  )
                })}
              </ColumnsContent>
              {columns.length !== 6 && (
                <Button
                  type="button"
                  title="+ Add New Column"
                  onClick={() => handleAddColumn()}
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
