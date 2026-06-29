import styled from 'styled-components'

export const StatusSelectorBtn = styled.button`
  position: relative;
  display: flex;
  padding: 0.5rem 0.6rem 0.5rem 2rem;
  align-items: center;
  cursor: pointer;
  border-radius: 7px;
  width: 100%;
  background-color: transparent;
  border: none;
  font-size: ${(props) => props.theme['body-l']};
  font-weight: 500;
  text-align: left;
  color: ${(props) => props.theme['text-color']};
  transition: background-color 140ms ease, color 140ms ease;

  &:hover {
    background-color: ${(props) => props.theme['card-hover']};
    color: ${(props) => props.theme['title-color']};
  }

  svg {
    position: absolute;
    color: ${(props) => props.theme['accent-color']};
    font-size: 0.85rem;
    left: 0.65rem;
  }

  span {
    margin-left: 0;
  }
`
