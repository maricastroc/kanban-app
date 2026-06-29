import styled from 'styled-components'

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${(props) => props.theme['muted-color']};
  margin-bottom: 0.5rem;

  svg {
    font-size: 0.72rem;
    color: ${(props) => props.theme['muted-color']};
  }
`
