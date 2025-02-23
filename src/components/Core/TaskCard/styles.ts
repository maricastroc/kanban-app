import styled from 'styled-components'

export const TaskCardContainer = styled.div`
  cursor: grab;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  border-radius: 8px;
  background-color: ${(props) => props.theme['cards-color']};
  width: 100%;
  align-items: flex-start;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: 300ms;

  strong {
    font-size: ${(props) => props.theme['heading-m']};
    font-weight: 700;
    color: ${(props) => props.theme['title-color']};
    line-height: 1.3rem;
  }

  p {
    font-size: ${(props) => props.theme['heading-s']};
    font-weight: 700;
    color: ${(props) => props.theme['subtitle-color']};
  }

  &:hover {
    animation: shake 0.4s ease-in-out;
    filter: brightness(0.85);
  }
`
