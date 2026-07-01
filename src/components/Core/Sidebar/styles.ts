import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-right: solid 1px ${(props) => props.theme['hairline-color']};
  min-width: 220px;
  background-color: ${(props) => props.theme['sidebar-color']};
  position: fixed;
  top: 0;
  height: 100vh;
  z-index: 100;
  overflow: hidden;
  transform: translateX(0);
  width: 220px;
  transition: transform 0.3s ease, width 0.3s ease;
  padding: 1rem 0 0.75rem;

  &::-webkit-scrollbar {
    display: none;
  }

  &.hidden {
    transform: translateX(-100%);
    min-width: 0;
    width: 0;
  }

  scrollbar-width: none;
`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;

  &::-webkit-scrollbar {
    display: none;
  }
`

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.25rem 1rem 1.4rem;

  .logo-mark {
    display: flex;
    width: 30px;
    height: 30px;
    border-radius: 9px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  span {
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.3px;
    color: ${(props) => props.theme['title-color']};
  }
`

export const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.15rem 0.5rem;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.7px;
  color: ${(props) => props.theme['muted-color']};
  text-transform: uppercase;
`

export const CreateBoardArea = styled.div`
  flex-shrink: 0;
  width: 100%;
  padding: 0 0.6rem;
`

export const CreateDivider = styled.div`
  height: 1px;
  margin: 0.45rem 0.5rem;
  background-color: ${(props) => props.theme['hairline-color']};
`

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0.75rem 0;
  margin-top: auto;
  border-top: 1px solid ${(props) => props.theme['hairline-color']};
`

export const HideButton = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.6rem;
  padding: 0.6rem 0.65rem;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  width: 100%;
  color: ${(props) => props.theme['muted-color']};
  transition: background-color 160ms, color 160ms;

  p {
    font-size: 0.8rem;
    font-weight: 500;
    color: inherit;
  }

  svg {
    color: inherit;
    font-size: 1.05rem;
  }

  &:hover {
    background-color: ${(props) => props.theme['hairline-color']};
    color: ${(props) => props.theme['text-color']};
  }
`
