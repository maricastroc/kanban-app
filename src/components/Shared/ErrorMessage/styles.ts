import styled from 'styled-components'

export const Error = styled.p`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.35rem;
  color: ${(props) => props.theme['error-text']};

  svg {
    flex-shrink: 0;
    font-size: 0.78rem;
    opacity: 0.85;
  }

  span {
    display: block;
    color: ${(props) => props.theme['error-text']};
    font-size: ${(props) => props.theme['body-m']};
    font-weight: 500;
    line-height: 1.3;
  }
`
