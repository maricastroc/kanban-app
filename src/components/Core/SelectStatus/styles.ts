import styled from 'styled-components'

export const SelectStatusField = styled.button`
  cursor: pointer;
  position: relative;
  display: flex;
  width: 100%;
  height: 46px;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.9rem;
  background-color: ${(props) => props.theme['field-bg']};
  border: 1px solid ${(props) => props.theme['border-color']};
  border-radius: 9px;
  transition: border-color 160ms ease, box-shadow 160ms ease,
    background-color 160ms ease;

  &:hover {
    border-color: ${(props) => props.theme['hairline-strong']};
  }

  &.active {
    border-color: ${(props) => props.theme['accent-color']};
    box-shadow: 0 0 0 3px ${(props) => props.theme['accent-soft']};
    background-color: ${(props) => props.theme['card-color']};
  }

  p {
    font-size: ${(props) => props.theme['body-l']};
    color: ${(props) => props.theme['title-color']};
  }

  svg {
    color: ${(props) => props.theme['muted-color']};
    font-size: 0.95rem;
    transition: color 160ms ease;
  }

  &.active svg {
    color: ${(props) => props.theme['accent-color']};
  }
`
