import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { Dropdown, DropdownItem } from '../../styles'

export interface DropdownMenuItem {
  key: string
  label: string
  selected: boolean
  onClick: () => void
  /** Optional color swatch shown before the label (used by the tag filter). */
  swatchColor?: string
}

interface Props {
  title: string
  items: DropdownMenuItem[]
  /** Optional header action, e.g. a "Clear" button. */
  action?: ReactNode
  /** Shown when there are no items. */
  emptyLabel?: string
}

export function DropdownMenu({ title, items, action, emptyLabel }: Props) {
  return (
    <Dropdown>
      <div className="dropdown-header">
        <span>{title}</span>
        {action}
      </div>
      {items.length > 0 ? (
        items.map((item) => (
          <DropdownItem
            key={item.key}
            className={item.selected ? 'selected' : ''}
            onClick={item.onClick}
          >
            {item.swatchColor && (
              <span
                className="swatch"
                style={{ backgroundColor: item.swatchColor }}
              />
            )}
            <span className="label">{item.label}</span>
            {item.selected && (
              <FontAwesomeIcon className="check" icon={faCheck} />
            )}
          </DropdownItem>
        ))
      ) : (
        <div className="empty">{emptyLabel}</div>
      )}
    </Dropdown>
  )
}
