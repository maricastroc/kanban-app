import styled from 'styled-components'

import { Content as RadixContent } from '@radix-ui/react-dialog'

export const ModalContent = styled(RadixContent)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.5rem 1.2rem;
  border-radius: 8px;
  position: absolute;
  gap: 0.8rem;
  top: 5rem;
  right: 0.7rem;
  width: 10rem;
  z-index: 10;
  background-color: ${(props) => props.theme['cards-color']};
  box-shadow: 0 4px 6px rgba(54, 78, 126, 0.1);

  &.dark {
    border: solid 1px ${(props) => props.theme['border-color']};
  }

  &.light {
    box-shadow: 0 4px 6px rgba(54, 78, 126, 0.1);
  }

  @media (min-width: 768px) {
    right: 2rem;
  }
`

export const ActionBtn = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  font-size: ${(props) => props.theme['heading-m']};
  font-weight: 700;

  &.edit {
    color: ${(props) => props.theme['subtitle-color']};
  }

  &.delete {
    color: ${(props) => props.theme['error-color']};
  }

  &:hover {
    filter: brightness(1.2);
    transition: 200ms;
  }
`
