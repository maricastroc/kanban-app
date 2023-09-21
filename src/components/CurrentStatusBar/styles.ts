import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 0.8rem;
`

export const StatusBarContainer = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: solid 2px ${(props) => props.theme['border-color']};
  border-radius: 8px;

  &.active {
    border: solid 2px ${(props) => props.theme['primary-color']};
  }

  p {
    font-size: 0.8125rem;
    color: ${(props) => props.theme['title-color']};
  }

  svg {
    color: ${(props) => props.theme['primary-color']};
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
  background-color: ${(props) => props.theme['bg-color']};
  border-radius: 8px;
  gap: 0.9rem;

  button {
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 0.8125rem;
    color: ${(props) => props.theme['subtitle-color']};

    &:focus {
      box-shadow: none;
    }

    &:hover {
      color: ${(props) => props.theme['title-color']};
      font-weight: 700;
    }
  }
`
