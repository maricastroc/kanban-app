import styled from 'styled-components'

export const Error = styled.p`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  margin-top: 0.5rem;
  padding: 0 0.1rem;

  svg {
    flex-shrink: 0;
    font-size: 0.62rem;
    color: ${(props) => props.theme['error-color']};
  }

  span {
    display: block;
    color: ${(props) => props.theme['error-text']};
    font-size: ${(props) => props.theme['body-m']};
    font-weight: 400;
    line-height: 1.4;
    letter-spacing: 0.1px;
  }
`
