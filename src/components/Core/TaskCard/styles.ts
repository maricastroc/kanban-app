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
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

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
    strong {
      color: ${(props) => props.theme['primary-color']};
    }
  }

  @keyframes shake {
    0% {
      transform: scale(1);
    }
    33% {
      transform: scale(1.03);
    }
    66% {
      transform: scale(0.97);
    }
    100% {
      transform: scale(1);
    }
  }
`
