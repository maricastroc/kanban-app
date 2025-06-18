import styled from 'styled-components'

export const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1.2rem;
`

export const StatusSelectorContainer = styled.div`
  margin-top: 0.7rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${(props) => props.theme['cards-color']};
  border: 1px solid ${(props) => props.theme['primary-color']};
  border-radius: 8px;
  padding: 0.5rem;

    svg {
      position: absolute;
      color: ${(props) => props.theme['primary-color']};
      font-size: 0.9rem;
      left: 0.2rem;
    }

    span {
      margin-left: 1.2rem;
    }
  }
`
