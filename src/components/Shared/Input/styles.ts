import styled from 'styled-components'

export const Input = styled.input`
  pointer-events: initial;
  opacity: 1;
  width: 100%;
  background-color: ${(props) => props.theme['cards-color']};
  border: solid 2px ${(props) => props.theme['border-color']};
  padding: 0.7rem 1rem;
  color: ${(props) => props.theme['title-color']};
  font-size: 0.8125rem;
  border-radius: 4px;

  &.error {
    border: solid 2px ${(props) => props.theme['error-color']};
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`
