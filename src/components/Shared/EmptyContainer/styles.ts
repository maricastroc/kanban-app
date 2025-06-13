import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  h2 {
    color: ${(props) => props.theme['subtitle-color']};
  }

  p {
    padding-top: 0.5rem;
    color: ${(props) => props.theme['subtitle-color']};
  }
`

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 90%;

  @media (min-width: 480px) {
    width: 25rem;
  }
`

export const ButtonContent = styled.div`
  padding-top: 1rem;
  width: 10rem;

  p {
    padding-top: 0;
    color: ${(props) => props.theme['details-color']};
  }
`

