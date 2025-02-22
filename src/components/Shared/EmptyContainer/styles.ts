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
  }
`

export const CreateBoardBtn = styled.button`
  cursor: pointer;
  display: flex;
  padding: 0.9rem 1.5rem;
  align-items: center;
  justify-content: flex-start;
  background-color: transparent;
  border: none;
  gap: 0.75rem;
  width: 100%;

  p {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: ${(props) => props.theme['heading-m']};
    font-weight: 700;
  }

  img {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 1.5rem;
  }

  &:focus {
    box-shadow: none;
  }

  &:hover {
    background-color: ${(props) => props.theme['primary-hover']};
    transition: 200ms;
    border-top-right-radius: 22px;
    border-bottom-right-radius: 22px;

    p {
      color: ${(props) => props.theme['button-title']};
    }

    img {
      filter: invert(39%) sepia(47%) saturate(748%) hue-rotate(203deg)
        brightness(94%) contrast(93%);
    }
  }
`
