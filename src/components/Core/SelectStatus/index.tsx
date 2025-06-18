import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { SelectStatusField } from './styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean
  isOpen: boolean
  status: string
}

export const SelectStatus = ({ status, isActive, isOpen, ...props }: Props) => {
  return (
    <SelectStatusField
      type="button"
      className={isOpen ? 'active' : ''}
      {...props}
    >
      <p>{status}</p>
      <FontAwesomeIcon icon={isActive ? faAngleUp : faAngleDown} />
    </SelectStatusField>
  )
}
