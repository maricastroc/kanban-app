import { useContext, useState } from 'react'

import { Button } from '@/components/Button'
import { BoardsContext } from '@/contexts/BoardsContext'
import { ColumnDTO } from '@/dtos/columnDTO'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Overlay,
  Title,
  Content,
  FormContainer,
  ColumnsContainer,
  RemoveColumnButton,
  InputNameContainer,
  Label,
  Description,
  ColumnsContent,
  InputColumnsContainer,
  InputColumnContent,
  InputColumn,
  FormError,
} from './styles'
import { BoardDTO } from '@/dtos/boardDTO'

interface EditBoardProps {
  board: BoardDTO
  onClose: () => void
}

const formSchema = z.object({
  name: z.string().min(3, { message: 'Name is required' }),
})

export type FormData = z.infer<typeof formSchema>

export function EditBoard({ board, onClose }: EditBoardProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    defaultValues: {
      name: board.name,
    },
    resolver: zodResolver(formSchema),
  })

  const { editBoard } = useContext(BoardsContext)

  const [boardColumns, setBoardColumns] = useState<ColumnDTO[]>(board.columns)

  const [columnErrors, setColumnErrors] = useState<string[]>([])

  const handleAddColumn = () => {
    const newColumn = {
      name: '',
      tasks: [],
    }
    setBoardColumns([...boardColumns, newColumn])
  }

  const handleRemoveColumn = (indexToRemove: number) => {
    const updatedColumns = boardColumns.filter(
      (_, index) => index !== indexToRemove,
    )
    setBoardColumns(updatedColumns)
  }

  const handleColumnChange = (index: number, newValue: string) => {
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

  function handleEditBoard(data: FormData) {
    const columnErrors = boardColumns.map((column) =>
      column.name === '' ? 'Required' : '',
    )

    const hasErrors = columnErrors.some((error) => error !== '')

    if (hasErrors) {
      setColumnErrors(columnErrors)
      return
    }

    editBoard(board, data.name, boardColumns)
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
          <h3>Edit Board</h3>
        </Title>
        <Description>
          <FormContainer onSubmit={handleSubmit(handleEditBoard)}>
            <InputNameContainer>
              <Label>Name</Label>
              <input type="text" {...register('name')} />
              {errors?.name && <FormError>{errors.name.message}</FormError>}
            </InputNameContainer>

            <ColumnsContainer>
              <Label>Columns</Label>
              <ColumnsContent>
                {boardColumns.map((column, index) =>
                  renderColumnInput(column, index),
                )}
              </ColumnsContent>
              {boardColumns.length !== 6 && (
                <Button
                  type="button"
                  title="+ Add New Column"
                  onClick={handleAddColumn}
                />
              )}
            </ColumnsContainer>

            <Button
              title="Save Changes"
              type="submit"
              variant="secondary"
              disabled={isSubmitting}
            />
          </FormContainer>
        </Description>
      </Content>
    </>
  )
}
