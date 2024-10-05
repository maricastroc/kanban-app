import styled from 'styled-components'

export const TextArea = styled.textarea`
  background-color: ${(props) => props.theme['cards-color']};
  border: solid 2px ${(props) => props.theme['border-color']};
  padding: 0.7rem 1rem;
  line-height: 1.3rem;
  color: ${(props) => props.theme['title-color']};
  font-size: ${(props) => props.theme['body-l']};
  border-radius: 4px;
  min-height: 112px;
  resize: none;
  width: 100%;

  &.error {
    border: solid 2px ${(props) => props.theme['error-color']};
  }
`
