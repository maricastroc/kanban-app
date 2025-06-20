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
  pointer-events: none
  height: 100vh;
  inset: 0;
  z-index: 9990;
  background-color: rgba(10, 10, 10, 0.7);
`

export const HeaderContent = styled.div`
  display: flex;
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

export const ModalContent = styled(RadixContent)<{ padding?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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

export const StatusSelectorContainer = styled.div`
  margin-top: 0.7rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${(props) => props.theme['cards-color']};
  border: 1px solid ${(props) => props.theme['primary-color']};
  border-radius: 8px;
  padding: 0.5rem;

    svg {
      position: absolute;
      color: ${(props) => props.theme['primary-color']};
      font-size: 0.9rem;
      left: 0.2rem;
    }

    span {
      margin-left: 1.2rem;
    }
  }
`

export const SelectStatusField = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: solid 2px ${(props) => props.theme['border-color']};
  border-radius: 8px;

  &.active {
    border: solid 1px ${(props) => props.theme['primary-color']};
  }

  p {
    font-size: ${(props) => props.theme['body-l']};
    color: ${(props) => props.theme['title-color']};
  }

  svg {
    color: ${(props) => props.theme['primary-color']};
    font-size: 1rem;
  }
`

export const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`

export const Loader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`

export const UncheckedBox = styled.button`
  cursor: pointer;
  min-width: 16px;
  min-height: 16px;
  background-color: ${(props) => props.theme['cards-color']};
  border: solid 1px ${(props) => props.theme['border-color']};
  border-radius: 3;

  &:focus {
    box-shadow: none;
  }
`

export const CheckedBox = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-width: 16px;
  min-height: 16px;
  background-color: ${(props) => props.theme['primary-color']};
  border: none;
  border-radius: 3;

  svg {
    color: ${(props) => props.theme['button-title']};
    font-size: 0.7rem;
  }

  &:focus {
    box-shadow: none;
  }
`

export const TagContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  justify-content: flex-start;
  padding: 0.85rem;
  background-color: ${(props) => props.theme['bg-color']};
  border-radius: 8px;
  width: 100%;

  p {
    color: ${(props) => props.theme['details-color']};
    font-size: 0.85rem;
  }
`

export const TagName = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  gap: 0.5rem;

  p {
    font-size: 0.75rem;
    margin-left: 1rem;
    font-weight: 700;
    color: ${(props) => props.theme['title-color']};
  }
`
