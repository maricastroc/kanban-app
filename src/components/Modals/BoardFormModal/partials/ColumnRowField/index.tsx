import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripVertical, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Sheet } from '../../../Sheet'
import { ColumnInput, ColumnRow, GripIcon, RemoveColumnBtn } from '../../styles'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'

interface Props {
  name: string
  error?: string
  /** Locks the input (used for columns that already exist on the board). */
  disabled?: boolean
  canRemove: boolean
  onChangeName: (value: string) => void
  onRemove: () => void
}

export function ColumnRowField({
  name,
  error,
  disabled = false,
  canRemove,
  onChangeName,
  onRemove,
}: Props) {
  return (
    <Sheet.FieldGroup>
      <ColumnRow className={error ? 'error' : ''}>
        <GripIcon>
          <FontAwesomeIcon icon={faGripVertical} />
        </GripIcon>
        <ColumnInput
          spellCheck={false}
          disabled={disabled}
          defaultValue={name}
          placeholder="e.g. Todo"
          onBlur={(e) => onChangeName(e.target.value)}
        />
        <RemoveColumnBtn
          type="button"
          aria-label="Remove column"
          disabled={!canRemove}
          onClick={() => canRemove && onRemove()}
        >
          <FontAwesomeIcon icon={faXmark} />
        </RemoveColumnBtn>
      </ColumnRow>
      <ErrorMessage message={error} />
    </Sheet.FieldGroup>
  )
}
