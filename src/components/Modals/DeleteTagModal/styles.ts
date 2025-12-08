import styled from 'styled-components'

export const DeleteTagContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  width: 100%;
  gap: 0.4rem;
  margin-top: 1rem;
  line-height: 1.25rem;

  h2 {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
  }

  p {
    color: ${(props) => props.theme['details-color']};
    font-size: 0.9rem;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
  width: 100%;
  gap: 0.5rem;

  @media (min-width: 480px) {
    flex-direction: row;
  }
`
