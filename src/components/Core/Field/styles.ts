import styled from 'styled-components'

export const Container = styled.div`
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
  font-size: ${(props) => props.theme['body-l']};
  border-radius: 4px;

  &.error {
    border: solid 1px ${(props) => props.theme['error-color']};
  }

  &.disabled {
    cursor: not-allowed;
    color: ${(props) => props.theme['subtitle-color']};
  }

  &:focus {
    border: solid 2px ${(props) => props.theme['primary-color']};
  }
`

export const DeleteFieldBtn = styled.button`
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

    svg {
      opacity: 0.2;
    }
  }
`
