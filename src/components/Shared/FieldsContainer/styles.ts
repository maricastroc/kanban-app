import styled from 'styled-components'

export const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;

  span {
    margin-top: 0.3rem;
    display: block;
    color: ${(props) => props.theme['error-color']};
    font-size: ${(props) => props.theme['body-m']};
    font-weight: 700;
    left: 75%;
  }
`
