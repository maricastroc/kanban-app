import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`

export const Input = styled.input`
  width: 100%;
  height: 44px;
  background-color: ${(props) => props.theme['field-bg']};
  border: 1px solid ${(props) => props.theme['border-color']};
  padding: 0 0.85rem;
  color: ${(props) => props.theme['title-color']};
  font-size: 0.85rem;
  border-radius: 9px;
  transition: border-color 160ms ease, box-shadow 160ms ease,
    background-color 160ms ease;

  &::placeholder {
    color: ${(props) => props.theme['muted-color']};
  }

  &:hover {
    border-color: ${(props) => props.theme['hairline-strong']};
  }

  &:focus,
  &:focus-visible {
    outline: none;
    border-color: ${(props) => props.theme['accent-color']};
    box-shadow: 0 0 0 3px ${(props) => props.theme['accent-soft']};
    background-color: ${(props) => props.theme['card-color']};
  }

  &.error {
    border-color: ${(props) => props.theme['error-color']};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const DeleteFieldBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  cursor: pointer;
  background-color: transparent;
  border: 1px solid transparent;
  pointer-events: initial;
  border-radius: 8px;
  transition: background-color 140ms ease, color 140ms ease;

  svg {
    font-size: 1rem;
    color: ${(props) => props.theme['muted-color']};
  }

  &:hover:not(.disabled) {
    background-color: ${(props) => props.theme['hairline-color']};

    svg {
      color: ${(props) => props.theme['error-color']};
    }
  }

  &.disabled {
    cursor: not-allowed;

    svg {
      opacity: 0.25;
    }
  }
`
