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
  Input,
  InputContainer,
  FormError,
  InputColumnContent,
} from './styles'
import { Button } from '@/components/Button'
import { ColumnDTO } from '@/dtos/columnDTO'
import { BoardsContext } from '@/contexts/BoardsContext'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface AddBoardProps {
  onClose: () => void
}

const formSchema = z.object({
  name: z.string().min(3, { message: 'Name is required' }),
})

export type FormData = z.infer<typeof formSchema>

const initialBoardColumns = [
  {
    name: 'Todo',
    tasks: [],
  },
  {
    name: 'Doing',
    tasks: [],
  },
]

export function AddBoard({ onClose }: AddBoardProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const { createNewBoard } = useContext(BoardsContext)

  const [boardColumns, setBoardColumns] =
    useState<ColumnDTO[]>(initialBoardColumns)

  const [columnErrors, setColumnErrors] = useState<string[]>([])

  function handleAddColumn() {
    const newColumn = {
      name: '',
      tasks: [],
    }
    setBoardColumns([...boardColumns, newColumn])
  }

  function handleRemoveColumn(indexToRemove: number) {
    const updatedColumns = boardColumns.filter(
      (_, index) => index !== indexToRemove,
    )
    setBoardColumns(updatedColumns)
  }

  function handleColumnChange(index: number, newValue: string) {
    const updatedColumns = [...boardColumns]
    updatedColumns[index].name = newValue

    const newColumnErrors = [...columnErrors]
    if (newValue.length === 0) {
      newColumnErrors[index] = 'Required'
    } else {
      newColumnErrors[index] = ''
    }

    setBoardColumns(updatedColumns)
  }

  function renderColumnInput(column: ColumnDTO, index: number) {
    const columnKey = `column-${index}`

    return (
      <InputColumnsContainer key={columnKey}>
        {boardColumns.length !== 1 ? (
          <>
            <InputColumnContent>
              <InputColumn
                type="text"
                placeholder="e.g. Todo"
                defaultValue={boardColumns[index].name}
                className={`${column.tasks.length > 0 ? 'disabled' : ''} ${
                  columnErrors[index] ? 'error' : ''
                }`}
                onChange={(e) => handleColumnChange(index, e.target.value)}
              />
              <RemoveColumnButton
                className={
                  boardColumns[index].tasks.length > 0 ? 'disabled' : ''
                }
                onClick={() => handleRemoveColumn(index)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </RemoveColumnButton>
            </InputColumnContent>
            {columnErrors[index] && <span>{columnErrors[index]}</span>}
          </>
        ) : (
          <>
            <Input
              type="text"
              defaultValue={boardColumns[index].name}
              placeholder="e.g. Todo"
              className={`${column.tasks.length > 0 ? 'disabled' : ''} ${
                columnErrors[index] ? 'error' : ''
              }`}
              onChange={(e) => handleColumnChange(index, e.target.value)}
            />
            {columnErrors[index] && <span>{columnErrors[index]}</span>}
          </>
        )}
      </InputColumnsContainer>
    )
  }

  function handleCreateNewBoard(data: FormData) {
    const columnErrors = boardColumns.map((column) =>
      column.name === '' ? 'Required' : '',
    )

    const hasErrors = columnErrors.some((error) => error !== '')

    if (hasErrors) {
      setColumnErrors(columnErrors)
      return
    }

    createNewBoard(data.name, boardColumns)
    onClose()
  }

  return (
    <>
      <Overlay onClick={() => onClose()} />
      <Content>
        <Title>
          <h3>Add New Board</h3>
        </Title>
        <Description>
          <FormContainer onSubmit={handleSubmit(handleCreateNewBoard)}>
            <InputContainer>
              <Label>Board Name</Label>
              <Input placeholder="e.g. Web Design" {...register('name')} />
              {errors?.name && <FormError>{errors.name.message}</FormError>}
            </InputContainer>

            <ColumnsContainer>
              <Label>Board Columns</Label>
              <ColumnsContent>
                {boardColumns.map((column, index) =>
                  renderColumnInput(column, index),
                )}
              </ColumnsContent>
              {boardColumns.length !== 6 && (
                <Button
                  type="button"
                  title="+ Add New Column"
                  onClick={() => handleAddColumn()}
                />
              )}
            </ColumnsContainer>

            <Button
              type="submit"
              title="Save Changes"
              variant="secondary"
              disabled={isSubmitting}
            />
          </FormContainer>
        </Description>
      </Content>
    </>
  )
}
