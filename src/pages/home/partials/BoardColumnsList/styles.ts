import styled from 'styled-components'

export const AddColumnContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 11rem;
  max-width: 11rem;
  align-self: flex-start;
  min-height: 120px;
  border: 1.5px dashed ${(props) => props.theme['hairline-strong']};
  border-radius: 12px;
  background-color: transparent;
  transition: border-color 160ms, background-color 160ms;

  &:hover {
    border-color: ${(props) => props.theme['accent-color']};
    background-color: ${(props) => props.theme['accent-soft']};

    button {
      color: ${(props) => props.theme['accent-text']};
    }
  }
`

export const AddColumnBtn = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background-color: transparent;
  border: none;
  font-size: 0.82rem;
  font-weight: 600;
  color: ${(props) => props.theme['muted-color']};
  transition: color 160ms;

  span {
    font-size: 1.05rem;
    line-height: 1;
  }
`
