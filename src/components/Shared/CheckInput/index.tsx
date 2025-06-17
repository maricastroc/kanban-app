import { ButtonHTMLAttributes } from 'react'
import { CheckedBox, UncheckedBox } from './styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  isChecked?: boolean
}

export const CheckInput = ({ isChecked, ...rest }: Props) => {
  return isChecked ? (
    <CheckedBox type="button" {...rest}>
      <FontAwesomeIcon icon={faCheck} />
    </CheckedBox>
  ) : (
    <UncheckedBox type="button" {...rest} />
  )
}
