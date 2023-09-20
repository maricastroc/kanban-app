import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`

export const Input = styled.input`
  width: 100%;
  background-color: ${(props) => props.theme['gray-600']};
  border: solid 1px ${(props) => props.theme['gray-500']};
  padding: 0.7rem 1rem;
  color: ${(props) => props.theme['white-color']};
  font-size: 0.8125rem;
  border-radius: 4px;

  &.error {
    border: solid 2px ${(props) => props.theme['red-500']};
  }

  &.disabled {
    pointer-events: none;
    color: ${(props) => props.theme['gray-400']};
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
    color: ${(props) => props.theme['gray-400']};
  }

  &.disabled {
    cursor: not-allowed;
    pointer-events: none;

    svg {
      opacity: 0.2;
    }
  }
`
