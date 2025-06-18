import styled from 'styled-components'

export const Description = styled.div`
  display: flex;
  margin-top: 1.5rem;
  flex-direction: column;
  width: 100%;

  > p {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: ${(props) => props.theme['body-l']};
    line-height: 1.4rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
  }
`
