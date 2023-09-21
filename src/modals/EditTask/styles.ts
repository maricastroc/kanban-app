import styled from 'styled-components'

export const StatusBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const StatusBarContent = styled.div`
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
    color: ${(props) => props.theme.white};
  }

  svg {
    color: ${(props) => props.theme.purple500};
    font-size: 1rem;
  }
`

export const OptionsContainer = styled.div`
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

export const SubtasksContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const SubtasksContent = styled.p`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`
export const InputVariantContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`

export const Input = styled.input`
  width: 100%;
  background-color: ${(props) => props.theme['cards-color']};
  border: solid 1px ${(props) => props.theme['border-color']};
  padding: 0.7rem 1rem;
  color: ${(props) => props.theme['title-color']};
  font-size: 0.8125rem;
  border-radius: 4px;

  &.error {
    border: solid 2px ${(props) => props.theme['error-color']};
  }

  &.disabled {
    pointer-events: none;
    color: ${(props) => props.theme['subtitle-color']};
  }
`

export const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: transparent;
  border: none;
  pointer-events: initial;

  svg {
    font-size: 1.5rem;
    color: ${(props) => props.theme['subtitle-color']};
  }

  &.disabled {
    cursor: not-allowed;
    pointer-events: none;

    svg {
      opacity: 0.2;
    }
  }
`
