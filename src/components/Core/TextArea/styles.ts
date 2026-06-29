import styled from 'styled-components'

export const TextArea = styled.textarea`
  background-color: ${(props) => props.theme['field-bg']};
  border: 1px solid ${(props) => props.theme['border-color']};
  padding: 0.75rem 0.9rem;
  line-height: 1.45rem;
  color: ${(props) => props.theme['title-color']};
  font-size: 0.85rem;
  border-radius: 9px;
  min-height: 104px;
  resize: none;
  width: 100%;
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
`
