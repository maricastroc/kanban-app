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
  z-index: 9998;
  background-color: 'transparent';
`

export const ModalContent = styled(RadixContent)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 3rem;
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
`

export const ModalTitle = styled(RadixTitle)`
  font-size: 1.125rem;
  font-weight: 700;
  max-width: 100%;

  &.delete {
    color: ${(props) => props.theme['error-color']};
  }
`

export const ColumnsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const ColumnsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`