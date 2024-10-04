import styled from 'styled-components'

import { Content as RadixContent } from '@radix-ui/react-dialog'

export const ModalContent = styled(RadixContent)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.2rem;
  border-radius: 8px;
  position: absolute;
  gap: 0.7rem;
  top: 4.5rem;
  right: 0.7rem;
  width: 10rem;
  z-index: 10;
  background-color: ${(props) => props.theme['bg-color']};
`

export const ActionBtn = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  font-size: 1rem;

  &.edit {
    color: ${(props) => props.theme['subtitle-color']};
  }

  &.delete {
    color: ${(props) => props.theme['error-color']};
  }
`
