import styled from 'styled-components'

import {
  Overlay as RadixOverlay,
  Content as RadixContent,
  Title as RadixTitle,
} from '@radix-ui/react-dialog'

export const ModalOverlay = styled(RadixOverlay)`
  position: fixed;
  width: 100vw;
  height: 100vh;
  inset: 0;
  z-index: 9990;
  background-color: rgba(10, 10, 10, 0.7);
`

export const ModalTitle = styled(RadixTitle)`
  font-size: ${(props) => props.theme['heading-l']};
  font-weight: 700;
  max-width: 100%;

  &.delete {
    color: ${(props) => props.theme['error-color']};
  }
`

export const ModalContent = styled(RadixContent)<{ padding?: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${(props) => props.padding || '1.5rem'};
  height: 90vh;
  max-height: 30rem;
  background-color: ${(props) => props.theme['cards-color']};
  border: none;
  overflow-y: auto;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: clamp(300px, 90vw, 33rem);
  border-radius: 8px;
  z-index: 9999;

  &:focus {
    box-shadow: none;
  }

  &.bigger {
    max-height: 35rem;
  }
`