import styled from 'styled-components'

import { Content as RadixContent } from '@radix-ui/react-dialog'

export const ModalContent = styled(RadixContent)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 8px;
  position: absolute;
  top: 5rem;
  right: 0.7rem;
  width: 12rem;
  z-index: 10;
  background-color: ${(props) => props.theme['bg-color']};
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  &.light {
    box-shadow: 0 4px 6px rgba(54, 78, 126, 0.1);
  }

  span {
    background-color: ${(props) => props.theme['border-color']};
    width: 100%;
    height: 2px;
    margin: 0.2rem 0;
  }

  @media (min-width: 768px) {
    right: 2rem;
  }
`

export const ActionBtn = styled.button<{ disabled?: boolean }>`
  cursor: pointer;
  background-color: transparent;
  border: 2px solid transparent;
  padding: 0.3rem;
  border-radius: 8px;
  font-size: ${(props) => props.theme['heading-m']};
  color: ${(props) => props.theme['subtitle-color']};

  &.edit {
    color: ${(props) => props.theme['subtitle-color']};
  }

  &.delete {
    color: ${(props) => props.theme['error-color']};
  }

  &:not([disabled]):hover {
    filter: brightness(1.2);
    transition: 200ms;
  }

  &[disabled] {
    cursor: not-allowed;
    filter: none;
    color: ${(props) => props.theme['disabled-color'] || '#999'};
  }
`

export const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background-color: transparent;
  border: none;
  font-size: ${(props) => props.theme['heading-m']};
  color: ${(props) => props.theme['subtitle-color']};
  width: 100%;
  border-top: solid 1px ${(props) => props.theme['border-color']};
  border: 2px solid transparent;
  padding: 0.3rem;
  border-radius: 8px;

  svg {
    color: ${(props) => props.theme['subtitle-color']};
  }

  &:hover {
    transition: 200ms;
    color: ${(props) => props.theme['error-color']};

    svg {
      color: ${(props) => props.theme['error-color']};
    }
  }
`
