import styled from 'styled-components'

export const Input = styled.input`
  pointer-events: initial;
  opacity: 1;
  width: 100%;
  background-color: ${(props) => props.theme['cards-color']};
  border: solid 2px ${(props) => props.theme['border-color']};
  padding: 0.7rem 1rem;
  color: ${(props) => props.theme['title-color']};
  font-size: ${(props) => props.theme['body-l']};
  border-radius: 4px;

  &.error {
    border: solid 1px ${(props) => props.theme['error-color']};
  }

  &.transparent {
    background-color: transparent;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:-webkit-autofill {
    background-color: transparent !important;
    color: ${(props) => props.theme['secondary-color']} !important;
    box-shadow: 0 0 0px 1000px transparent inset !important;
  }

  &:-moz-placeholder {
    background-color: transparent;
  }

  &::-webkit-input-placeholder {
    background-color: transparent;
  }
`
