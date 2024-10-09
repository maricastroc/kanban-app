import styled from 'styled-components'

import { Title as RadixTitle } from '@radix-ui/react-dialog'

export const ModalTitle = styled(RadixTitle)`
  font-size: ${(props) => props.theme['heading-l']};
  font-weight: 700;
  max-width: 100%;

  &.delete {
    color: ${(props) => props.theme['error-color']};
  }
`

export const LayoutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  h3 {
    font-size: ${(props) => props.theme['heading-l']};
    font-weight: 700;
    max-width: 85%;
  }
`

export const Description = styled.div`
  display: flex;
  margin-top: 1.5rem;
  flex-direction: column;
  width: 100%;

  > p {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: ${(props) => props.theme['body-l']};
    line-height: 1.4rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
  }
`

export const SubtasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

export const OptionsBtn = styled.button`
  cursor: pointer;
  display: flex;
  background-color: transparent;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  align-items: center;
  justify-content: center;

  svg {
    cursor: pointer;
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 1.5rem;
  }

  &:hover {
    background-color: ${(props) => props.theme['bg-color']};
    transition: 200ms;
  }
`

export const OptionsModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.2rem;
  border-radius: 8px;
  position: absolute;
  gap: 0.7rem;
  top: 2.5rem;
  right: 0;
  width: 8rem;
  background-color: ${(props) => props.theme['cards-color']};

  &.dark {
    border: solid 1px ${(props) => props.theme['border-color']};
  }

  &.light {
    box-shadow: 0 4px 6px rgba(54, 78, 126, 0.1);
  }

  button {
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
  }
`

export const EmptySubtask = styled.p`
  color: ${(props) => props.theme['subtitle-color']};
  font-size: ${(props) => props.theme['body-l']};
  line-height: 1.4rem;
  margin-top: 0.5rem;
`
