import styled from 'styled-components'

import {
  Overlay as RadixOverlay,
  Content as RadixContent,
  Title as RadixTitle,
  Description as RadixDescription,
} from '@radix-ui/react-dialog'

export const ModalOverlay = styled(RadixOverlay)`
  position: fixed;
  width: 100vw;
  height: 100vh;
  inset: 0;
  z-index: 9998;
  background-color: rgba(10, 10, 10, 0.7);
`

export const ModalContent = styled(RadixContent)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 3rem;
  height: 90vh;
  overflow: scroll;
  background-color: ${(props) => props.theme['cards-color']};
  border: none;
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

export const ModalDescription = styled(RadixDescription)`
  display: flex;
  flex-direction: column;
  width: 100%;
`
export const StatusOptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const StatusOptionsContainer = styled.div`
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
    border: solid 2px ${(props) => props.theme['primary-color']};
  }

  p {
    font-size: 0.8125rem;
    color: ${(props) => props.theme['title-color']};
  }

  svg {
    color: ${(props) => props.theme['primary-color']};
    font-size: 1rem;
  }
`

export const SelectStatusContainer = styled.div`
  margin-top: 0.7rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  background-color: ${(props) => props.theme['bg-color']};
  border-radius: 8px;
  gap: 0.9rem;

  button {
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 0.8125rem;
    color: ${(props) => props.theme['subtitle-color']};

    &:focus {
      box-shadow: none;
    }

    &:hover {
      color: ${(props) => props.theme['title-color']};
      font-weight: 700;
    }
  }
`

export const SubtasksForm = styled.div`
  display: flex;
  flex-direction: column;
`

export const SubtasksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`
