import styled from 'styled-components'

export const Input = styled.input`
  pointer-events: initial;
  opacity: 1;
  width: 100%;
  height: 46px;
  background-color: ${(props) => props.theme['field-bg']};
  border: 1px solid ${(props) => props.theme['border-color']};
  padding: 0 0.9rem;
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
    border-color: ${(props) => props.theme['error-border']};
    background-color: ${(props) => props.theme['error-soft']};
  }

  &.error:focus,
  &.error:focus-visible {
    border-color: ${(props) => props.theme['error-border']};
    box-shadow: 0 0 0 3px ${(props) => props.theme['error-soft']};
  }

  &.transparent {
    background-color: transparent;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`
