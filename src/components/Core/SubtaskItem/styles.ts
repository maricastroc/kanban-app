import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  min-height: 44px;
  padding: 0.5rem 0.7rem;
  background-color: ${(props) => props.theme['field-bg']};
  border: 1px solid ${(props) => props.theme['border-color']};
  border-radius: 9px;
  transition: border-color 160ms ease, background-color 160ms ease;

  &:hover {
    border-color: ${(props) => props.theme['hairline-strong']};
  }
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
