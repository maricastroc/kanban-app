import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.7rem 0.8rem;
  border-radius: 10px;
  background-color: ${(props) => props.theme['panel-color']};
  border: 1px solid ${(props) => props.theme['hairline-strong']};
  box-shadow: ${(props) => props.theme['shadow-lg']};

  > svg {
    flex-shrink: 0;
    font-size: 0.85rem;
    color: ${(props) => props.theme['muted-color']};
  }
`

export const Message = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${(props) => props.theme['title-color']};
`

export const UndoButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-left: 0.4rem;
  padding: 0.32rem 0.6rem;
  border: none;
  border-radius: 7px;
  background-color: ${(props) => props.theme['accent-soft']};
  color: ${(props) => props.theme['accent-text']};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 140ms ease, color 140ms ease;

  svg {
    font-size: 0.75rem;
  }

  &:hover {
    background-color: ${(props) => props.theme['accent-color']};
    color: #fff;
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme['accent-color']};
    outline-offset: 2px;
  }
`
