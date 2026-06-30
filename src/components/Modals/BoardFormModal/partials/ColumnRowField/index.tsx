import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripVertical, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Sheet } from '../../../Sheet'
import {
  ColumnInput,
  ColumnRow,
  DragHandle,
  RemoveColumnBtn,
} from '../../styles'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'

interface Props {
  /** Stable client-side id used as the sortable key. */
  id: string
  name: string
  error?: string
  /** Locks the input (used for columns that already exist on the board). */
  disabled?: boolean
  canRemove: boolean
  /** Renders the drag handle and enables reordering (off in the add-column modal). */
  sortable?: boolean
  dragDisabled?: boolean
  onChangeName: (value: string) => void
  onRemove: () => void
}

export function ColumnRowField({
  id,
  name,
  error,
  disabled = false,
  canRemove,
  sortable = true,
  dragDisabled = false,
  onChangeName,
  onRemove,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: dragDisabled || !sortable })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 1 : undefined,
    position: 'relative',
  }

  return (
    <Sheet.FieldGroup>
      <ColumnRow
        ref={setNodeRef}
        style={style}
        className={error ? 'error' : ''}
      >
        {sortable && (
          <DragHandle
            ref={setActivatorNodeRef}
            type="button"
            className="column-drag-handle"
            aria-label="Drag to reorder column"
            disabled={dragDisabled}
            {...attributes}
            {...listeners}
          >
            <FontAwesomeIcon icon={faGripVertical} />
          </DragHandle>
        )}
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
