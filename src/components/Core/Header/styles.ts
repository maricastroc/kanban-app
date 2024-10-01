import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 4rem;
  overflow: hidden;
  padding: 1.25rem 1rem;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme['cards-color']};
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


