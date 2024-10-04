import styled from 'styled-components'
import { Root as RadixRoot, Thumb as RadixThumb } from '@radix-ui/react-switch'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: solid 1px ${(props) => props.theme['border-color']};
  min-width: 260px;
  background-color: ${(props) => props.theme['cards-color']};
  height: 100%;
  overflow: auto;
  position: sticky;
`

export const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  background-color: ${(props) => props.theme['cards-color']};
  align-items: flex-start;
`

export const Title = styled.h3`
  display: flex;
  justify-content: flex-start;
  padding: 1.875rem 1.5rem 0;
  width: 100%;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${(props) => props.theme['subtitle-color']};
  text-transform: uppercase;
  letter-spacing: 1.5px;
`

export const BoardsContainer = styled.div`
  display: flex;
  margin-top: 1.25rem;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: ${(props) => props.theme['cards-color']};
  padding-right: 1.5rem;
  gap: 0.5rem;
`

export const Board = styled.button`
  cursor: pointer;
  display: flex;
  padding: 0.9rem 1.5rem;
  align-items: center;
  justify-content: flex-start;
  background-color: transparent;
  border: none;
  gap: 0.75rem;
  width: 100%;

  &.active {
    background-color: ${(props) => props.theme['primary-color']};
    border-top-right-radius: 22px;
    border-bottom-right-radius: 22px;

    p {
      color: ${(props) => props.theme['button-title']};
    }

    img {
      filter: brightness(1.5);
    }
  }

  &.create {
    p {
      color: ${(props) => props.theme['primary-color']};
    }

    img {
      filter: invert(39%) sepia(47%) saturate(748%) hue-rotate(203deg)
        brightness(94%) contrast(93%);
    }

    &:hover {
      background-color: transparent;

      img {
        filter: invert(39%) sepia(47%) saturate(748%) hue-rotate(203deg)
          brightness(130%) contrast(93%);
      }

      p {
        color: ${(props) => props.theme['primary-hover']};
        transition: 200ms;
      }
    }
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

export const NewBoardBtn = styled.button`
  p {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 0.93rem;
    font-weight: 700;
  }

  img {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 1.5rem;
  }
`

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  justify-content: space-between;
  min-height: 100vh;
  gap: 1rem;
  background-color: ${(props) => props.theme['cards-color']};
`

export const HideButton = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.65rem;
  padding: 0.7rem;
  background-color: transparent;
  border: none;
  padding-left: 1.5rem;
  margin-bottom: 2rem;
  width: 90%;
  border-top-right-radius: 22px;
  border-bottom-right-radius: 22px;

  p {
    font-size: 0.93rem;
    font-weight: 700;
    color: ${(props) => props.theme['subtitle-color']};
  }

  svg {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 1.3rem;
    margin-left: 1.5rem;
  }

  &:hover {
    background-color: ${(props) => props.theme['primary-hover']};
    transition: 200ms;

    p {
      color: ${(props) => props.theme['button-title']};
    }
  }

  @media (min-width: 1024px) {
    padding-left: 0.5rem;
  }
`

export const ThemeSwitcherContainer = styled.div`
  background-color: ${(props) => props.theme['bg-color']};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  gap: 1.5rem;
  width: 85%;
  margin: 0 auto;

  svg {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 1.5rem;
  }
`

export const SwitchRoot = styled(RadixRoot)`
  cursor: pointer;
  width: 40px;
  height: 20px;
  background-color: ${(props) => props.theme['primary-color']};
  border-radius: 9999px;
  position: relative;
  box-shadow: none;
  border: none;

  &:hover {
    background-color: ${(props) => props.theme['primary-hover']};
    transition: 200ms;
  }
`

export const SwitchThumb = styled(RadixThumb)`
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${(props) => props.theme['button-title']};
  top: 3px;
  transform: translateX(-16px);
  transition: transform 0.2s ease;

  &[data-state='checked'] {
    transform: translateX(2px);
  }
`
