import styled from 'styled-components'

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 0.7rem;
  width: 100%;

  span {
    margin-top: 0.3rem;
    display: block;
    color: ${(props) => props.theme['error-color']};
    font-size: ${(props) => props.theme['body-m']};
    font-weight: 700;
    left: 75%;
  }
`
