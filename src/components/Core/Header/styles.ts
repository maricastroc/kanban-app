import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 5rem;
  padding: 1.25rem 1rem;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme['cards-color']};
  position: sticky;
  top: 0;
  z-index: 10;

  @media (min-width: 768px) {
    justify-content: space-between;
    height: 6rem;
    padding: 2rem;
    border-bottom: solid 1px ${(props) => props.theme['border-color']};
  }
`
export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`

export const BoardNameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${(props) => props.theme['primary-color']};
    font-size: 0.85rem;
    margin-top: 0.3rem;
  }
`

export const BoardName = styled.h1`
  font-size: ${(props) => props.theme['heading-l']};
  font-weight: 800;

  @media (min-width: 768px) {
    font-size: ${(props) => props.theme['heading-xl']};
  }

  @media (min-width: 1023px) {
    font-size: ${(props) => props.theme['heading-xxl']};
  }
`

export const EditDeleteContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    cursor: pointer;
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 1.5rem;
  }

  @media (min-width: 768px) {
    gap: 1rem;
  }
`

export const AddTaskBtn = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme['primary-color']};
  width: 48px;
  height: 32px;
  border: none;
  border-radius: 16px;

  svg {
    font-size: 1rem;
    color: ${(props) => props.theme['button-title']};
  }

  p {
    display: none;
  }

  &:hover {
    transition: 200ms;
    background-color: ${(props) => props.theme['tertiary-hover']};
  }

  @media (min-width: 768px) {
    gap: 1.5rem;
    width: 164px;
    height: 48px;
    border-radius: 22px;

    svg {
      display: none;
    }

    p {
      display: block;
      font-size: ${(props) => props.theme['heading-m']};
      color: ${(props) => props.theme['button-title']};
      font-weight: 700;
    }
  }
`

export const EditDeleteBtn = styled.button`
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

  &:focus {
    box-shadow: none;
  }
`

export const EditDeleteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
`
