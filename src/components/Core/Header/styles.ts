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
    padding: 0;
    justify-content: initial;
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

  @media (min-width: 1024px) {
    font-size: 1.5rem;
  }
`

export const OptionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  svg {
    cursor: pointer;
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 1.5rem;
  }
`

export const AddTaskBtn = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme['primary-color']};
  width: 3rem;
  height: 2rem;
  border: none;
  border-radius: 1rem;

  svg {
    font-size: 1rem;
    color: ${(props) => props.theme['button-title']};
  }
`

export const OpenMoreOptionsBtn = styled.button`
  display: flex;
  background-color: transparent;
  border: none;
`

export const MoreOptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
