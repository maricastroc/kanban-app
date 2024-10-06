import styled from 'styled-components'

export const StatusSelectorBtn = styled.button`
  position: relative;
  display: flex;
  padding: 0.5rem;
  padding-left: 0rem;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  width: 100%;
  background-color: transparent;
  border: none;
  font-size: ${(props) => props.theme['body-l']};
  font-weight: 500;
  text-align: flex-start;
  color: ${(props) => props.theme['subtitle-color']};

  &:focus {
    box-shadow: none;
  }

  &:hover {
    background-color: ${(props) => `${props.theme['subtitle-color']}1A`};
    font-weight: 700;
  }

  svg {
    position: absolute;
    color: ${(props) => props.theme['primary-color']};
    font-size: 0.9rem;
    left: 0.2rem;
  }

  span {
    margin-left: 1.2rem;
  }
`
