import { LayoutContainer, ColumnContent } from './styles'

import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'
import { BoardColumnProps } from '@/@types/board-column'

import { Button } from '@/components/Core/Button'
import { FieldsContainer } from '@/components/Core/FieldsContainer'
import { Field } from '@/components/Core/Field'
import { CustomLabel } from '@/components/Core/Label'
import { CustomInput } from '@/components/Core/Input'
import { InputContainer } from '@/components/Core/InputContainer'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { FormContainer } from '@/components/Core/FormContainer'
import { BaseModal } from '../BaseModal'
import { useBoardForm } from '@/hooks/useBoardForm'

interface ColumnFormModalProps {
  onClose: () => void
}

export function ColumnFormModal({ onClose }: ColumnFormModalProps) {
  useEscapeKeyHandler(onClose)

  const {
    activeBoard,
    errors,
    isLoading,
    isSubmitting,
    boardColumns,
    register,
    handleSubmitBoard,
    handleAddColumn,
    handleChangeColumn,
    handleRemoveColumn,
    handleSubmit,
  } = useBoardForm({ isEditing: true, onClose })

  const renderColumnInput = (column: BoardColumnProps, index: number) => {
    const error = errors.columns?.[index]?.name?.message

    const isDisabled = activeBoard?.columns.some(
      (existingColumn) => existingColumn.name === column.name,
    )

    return (
      <FieldsContainer key={index}>
        <Field
          key={index}
          hasError={!!error}
          isDisabled={isDisabled}
          btnVariant={isDisabled ? 'disabled' : ''}
          defaultValue={column.name}
          placeholder="e.g. New Column"
          onChange={(e) => handleChangeColumn(index, e.target.value)}
          onClick={() => {
            const existingColumn = activeBoard?.columns?.some(
              (boardColumn) => boardColumn.id === column.id,
            )

            if (!existingColumn) {
              handleRemoveColumn(index)
            }
          }}
        />
        {<ErrorMessage message={error} />}
      </FieldsContainer>
    )
  }

  const hasNewColumns = () => {
    if (!activeBoard?.columns) return boardColumns.length > 0

    return boardColumns.some((boardColumn) => {
      return !activeBoard.columns.some(
        (activeColumn) =>
          activeColumn.id === boardColumn.id ||
          activeColumn.name === boardColumn.name,
      )
    })
  }

  return (
    <BaseModal isLoading={isLoading} onClose={onClose} title="Add New Column">
      <FormContainer onSubmit={handleSubmit(handleSubmitBoard)}>
        <InputContainer>
          <CustomLabel>Board Name</CustomLabel>
          <CustomInput
            disabled
            type="text"
            value={activeBoard?.name}
            {...register('name')}
          />
        </InputContainer>
        <LayoutContainer>
          <CustomLabel>Columns</CustomLabel>
          <ColumnContent>
            {boardColumns.map((column, index) => (
              <div key={`${column.name}-${index}`}>
                {renderColumnInput(column, index)}
              </div>
            ))}
          </ColumnContent>
          {boardColumns.length < 6 && (
            <Button
              variant="secondary"
              type="button"
              title="+ Add New Column"
              onClick={handleAddColumn}
              isLoading={isSubmitting}
            />
          )}
        </LayoutContainer>
        {hasNewColumns() && (
          <Button
            disabled={isSubmitting}
            title="Create Column"
            type="submit"
            variant="primary"
          />
        )}
      </FormContainer>
    </BaseModal>
  )
}
