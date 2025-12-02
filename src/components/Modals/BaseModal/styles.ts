import styled from 'styled-components'

import {
  Overlay as RadixOverlay,
  Content as RadixContent,
  Title as RadixTitle,
  Close as RadixClose,
} from '@radix-ui/react-dialog'

export const ModalOverlay = styled(RadixOverlay)`
  position: fixed;
  width: 100vw;
  height: 100vh;
  inset: 0;
  z-index: 9990;
  background-color: rgba(10, 10, 10, 0.7);
`

export const HeaderContent = styled.div<{ padding?: string }>`
  display: flex;
  padding: ${(props) => props.padding || '0'};
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.8rem;
`

export const CloseButton = styled(RadixClose)`
  font-size: 1rem;
  color: ${(props) => props.theme['subtitle-color']};
  background-color: transparent;
  padding: 0.2rem;
  border: none;
  cursor: pointer;
  transition: 200ms;

  &:hover {
    color: ${(props) => props.theme['title-color']};
  }
`

export const ModalTitle = styled(RadixTitle)`
  font-size: ${(props) => props.theme['heading-l']};
  font-weight: 700;
  max-width: 100%;

  &.delete {
    color: ${(props) => props.theme['error-color']};
  }
`

export const ModalLoading = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`

export const ModalContent = styled(RadixContent)<{
  padding?: string
  height?: string
  maxHeight?: string
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: ${(props) => props.padding || '1.5rem'};
  height: ${(props) => props.height || 'auto'};
  max-height: ${(props) => props.maxHeight || '30rem'};
  background-color: ${(props) => props.theme['cards-color']};
  border: none;
  overflow-y: auto;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: clamp(300px, 90vw, 33rem);
  border-radius: 8px;
  z-index: 9998;
  animation: scaleIn 0.5s ease-out forwards;

  &:focus {
    box-shadow: none;
  }

  &.lg {
    max-height: 35rem;
  }

  &.xl {
    height: auto;
    max-height: 35rem;
  }

  &.smaller {
    height: auto;
  }

  &.delete {
    height: auto;
    overflow: auto;
    max-height: auto;
    width: clamp(300px, 90vw, 28rem);
  }

  @keyframes scaleIn {
    0% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
`
