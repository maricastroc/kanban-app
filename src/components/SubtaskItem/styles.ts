import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  background-color: ${(props) => props.theme['gray-700']};
  border-radius: 8;
  padding: 0.85rem;
`

export const Title = styled.p`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${(props) => props.theme['white-color']};

  &.checked {
    color: ${(props) => props.theme['white-color']};
    opacity: 0.7;
    text-decoration: line-through;
  }

  &.unchecked {
    color: ${(props) => props.theme['white-color']};
    opacity: 1;
    text-decoration: none;
  }
`

export const UncheckedBox = styled.button`
  cursor: pointer;
  min-width: 16px;
  min-height: 16px;
  background-color: ${(props) => props.theme['gray-600']};
  border: solid 1px ${(props) => props.theme['gray-500']};
  border-radius: 3;

  &:focus {
    box-shadow: none;
  }
`

export const CheckedBox = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-width: 16px;
  min-height: 16px;
  background-color: ${(props) => props.theme['purple-500']};
  border: none;
  border-radius: 3;

  svg {
    color: ${(props) => props.theme['white-color']};
    font-size: 0.7rem;
  }

  &:focus {
    box-shadow: none;
  }
`
