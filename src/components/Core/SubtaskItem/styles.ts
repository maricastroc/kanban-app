import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  background-color: ${(props) => props.theme['bg-color']};
  border-radius: 8px;
  padding: 0.85rem;
`

export const Title = styled.p`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${(props) => props.theme['title-color']};

  &.checked {
    color: ${(props) => props.theme['title-color']};
    opacity: 0.7;
    text-decoration: line-through;
  }

  &.unchecked {
    color: ${(props) => props.theme['title-color']};
    opacity: 1;
    text-decoration: none;
  }
`
