import styled from 'styled-components'

export const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 0.5rem;
`

export const StatusSelectorContainer = styled.div`
  margin-top: 0.4rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: ${(props) => props.theme['card-color']};
  border: 1px solid ${(props) => props.theme['hairline-strong']};
  border-radius: 10px;
  box-shadow: ${(props) => props.theme['card-shadow']};
  padding: 0.3rem;
`
