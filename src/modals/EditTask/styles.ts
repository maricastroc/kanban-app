import styled from 'styled-components'

export const StatusBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const StatusBarContent = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: solid 2px ${(props) => props.theme['gray-500']};
  border-radius: 8px;

  &.active {
    border: solid 2px ${(props) => props.theme['purple-500']};
  }

  p {
    font-size: 0.8125rem;
    color: ${(props) => props.theme.white};
  }

  svg {
    color: ${(props) => props.theme.purple500};
    font-size: 1rem;
  }
`

export const OptionsContainer = styled.div`
  margin-top: 0.7rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  background-color: ${(props) => props.theme['gray-700']};
  border-radius: 8px;
  gap: 0.9rem;

  button {
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 0.8125rem;
    color: ${(props) => props.theme['gray-400']};

    &:focus {
      box-shadow: none;
    }

    &:hover {
      color: ${(props) => props.theme['white-color']};
      font-weight: 700;
    }
  }
`

export const SubtasksContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const SubtasksContent = styled.p`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`
