import styled from 'styled-components'

export const LayoutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  h3 {
    font-size: ${(props) => props.theme['heading-l']};
    font-weight: 700;
    max-width: 85%;
  }
`

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

export const OptionsBtn = styled.button`
  cursor: pointer;
  display: flex;
  background-color: transparent;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  align-items: center;
  justify-content: center;

  svg {
    cursor: pointer;
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 1.5rem;
  }

  &:hover {
    background-color: ${(props) => props.theme['bg-color']};
    transition: 200ms;
  }
`

export const OptionsModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.2rem;
  border-radius: 8px;
  position: absolute;
  gap: 0.7rem;
  top: 2.5rem;
  right: 0;
  width: 10rem;
  background-color: ${(props) => props.theme['bg-color']};

  &.light {
    box-shadow: 0 4px 6px rgba(54, 78, 126, 0.1);
  }

  button {
    cursor: pointer;
    background-color: transparent;
    border-radius: 4px;
    border: none;
    font-size: ${(props) => props.theme['heading-m']};

    &.edit {
      color: ${(props) => props.theme['subtitle-color']};
    }

    &.delete {
      color: ${(props) => props.theme['error-color']};
    }

    &:hover {
      filter: brightness(1.2);
      transition: 200ms;
    }
  }
`
export const Title = styled.p`
  font-size: ${(props) => props.theme['heading-l']};
  font-weight: 700;
  max-width: 100%;

  &.delete {
    color: ${(props) => props.theme['error-color']};
  }
`
