import toast from 'react-hot-toast'
import { MAX_COLUMNS } from '@/utils/constants'
import { BoardColumnProps } from '@/@types/board-column'
import { FormContainer } from '@/components/Core/FormContainer'
import { InputContainer } from '@/components/Core/InputContainer'
import { Button } from '@/components/Core/Button'
import { FieldsContainer } from '@/components/Core/FieldsContainer'
import { Field } from '@/components/Core/Field'
import { CustomInput } from '@/components/Core/Input'
import { CustomLabel } from '@/components/Core/Label'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { ColumnsContainer, ColumnsContent } from './styles'
import { BaseModal } from '../BaseModal'
import { useBoardForm } from '@/hooks/useBoardForm'

interface BoardModalProps {
  onClose: () => void
  isEditing: boolean
}

export function BoardFormModal({ onClose, isEditing }: BoardModalProps) {
  const {
    errors,
    boardColumns,
    isLoading,
    isSubmitting,
    register,
    handleAddColumn,
    handleChangeColumn,
    handleRemoveColumn,
    handleSubmit,
    handleSubmitBoard,
  } = useBoardForm({ isEditing, onClose })

  const renderColumnInput = (column: BoardColumnProps, index: number) => {
    const error = errors.columns?.[index]?.name?.message

    return (
      <FieldsContainer key={index}>
        <Field
          hasError={!!error}
          isDisabled={false}
          btnVariant={boardColumns?.length > 1 ? '' : 'disabled'}
          defaultValue={column.name}
          placeholder="e.g. New Column"
          onChange={(e) => handleChangeColumn(index, e.target.value)}
          onClick={() => {
            if (boardColumns?.length > 1) {
              handleRemoveColumn(index)
            } else {
              toast.error('Board needs to have at least one column.')
            }
          }}
        />
        {<ErrorMessage message={error} />}
      </FieldsContainer>
    )
  }

  return (
    <BaseModal
      onClose={onClose}
      isLoading={isLoading}
      title={isEditing ? 'Edit Board' : 'Create Board'}
      padding="1.5rem 1.5rem 3rem"
    >
      <FormContainer onSubmit={handleSubmit(handleSubmitBoard)}>
        <InputContainer>
          <CustomLabel htmlFor="name">Board Name</CustomLabel>
          <CustomInput
            hasError={!!errors.name}
            placeholder="e.g. Backend Tasks"
            {...register('name')}
          />
          {<ErrorMessage message={errors.name?.message} />}
        </InputContainer>

        <ColumnsContainer>
          <CustomLabel>Columns</CustomLabel>
          <ColumnsContent>
            {boardColumns.map((column, index) => (
              <div key={`${column.name}-${index}`}>
                {renderColumnInput(column, index)}
              </div>
            ))}
          </ColumnsContent>
          {boardColumns.length < MAX_COLUMNS && (
            <Button
              variant="secondary"
              type="button"
              title="+ Add New Column"
              onClick={handleAddColumn}
            />
          )}
        </ColumnsContainer>

        <Button
          disabled={isSubmitting}
          title={isEditing ? 'Save Changes' : 'Create Board'}
          type="submit"
          variant="primary"
        />
      </FormContainer>
    </BaseModal>
  )
}
