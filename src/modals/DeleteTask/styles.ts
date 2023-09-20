import styled from 'styled-components'

export const Description = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1.5rem;

  p {
    color: ${(props) => props.theme['gray-400']};
    font-size: 0.8125rem;
    line-height: 1.4rem;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  margin-top: 1.5rem;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
`
