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
  box-shadow: 0 4px 6px rgba(54, 78, 126, 0.1);

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
    transition: 200ms;

    strong {
      color: ${(props) => props.theme['primary-color']};
    }
  }
`
