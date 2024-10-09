import styled from 'styled-components'
import { Root as RadixRoot, Thumb as RadixThumb } from '@radix-ui/react-switch'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: solid 1px ${(props) => props.theme['border-color']};
  min-width: 260px;
  background-color: ${(props) => props.theme['cards-color']};
  position: sticky;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme['cards-color']};
`

export const LogoWrapper = styled.div`
  display: flex;
  margin: 2.3rem 0 2.5rem;
  align-items: center;
  gap: 1rem;
  padding-left: 1.7rem;
`

export const Title = styled.h3`
  display: flex;
  justify-content: flex-start;
  padding: 1.875rem 1.5rem 0;
  width: 100%;
  font-size: ${(props) => props.theme['heading-s']};
  font-weight: 700;
  color: ${(props) => props.theme['subtitle-color']};
  text-transform: uppercase;
  letter-spacing: 1.5px;
`

export const BoardsContainer = styled.div`
  display: flex;
  margin-top: 1.25rem;
  flex-direction: column;
  width: 100%;
  background-color: ${(props) => props.theme['cards-color']};
  padding-right: 1.5rem;
  gap: 0.5rem;
`

export const BoardBtn = styled.button`
  cursor: pointer;
  display: flex;
  padding: 0.9rem 1.5rem;
  align-items: center;
  justify-content: flex-start;
  background-color: transparent;
  border: none;
  gap: 0.75rem;
  width: 100%;
  text-align: left;

  p {
    color: ${(props) => props.theme['subtitle-color']};
    font-weight: 700;
  }

  &.active {
    background-color: ${(props) => props.theme['sidebar-btn-color']};
    border-top-right-radius: 22px;
    border-bottom-right-radius: 22px;

    p {
      color: ${(props) => props.theme['button-title']};
      font-size: ${(props) => props.theme['heading-m']};
    }

    img {
      filter: brightness(1.5);
    }
  }

  &:focus {
    box-shadow: none;
  }

  &:hover {
    background-color: ${(props) => `${props.theme['sidebar-btn-hover']}`};
    transition: 200ms;
    border-top-right-radius: 22px;
    border-bottom-right-radius: 22px;

    p {
      color: ${(props) => props.theme['primary-color']};
    }

    img {
      filter: invert(39%) sepia(47%) saturate(748%) hue-rotate(203deg)
        brightness(94%) contrast(93%);
    }
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
  text-align: left;

  p {
    color: ${(props) => props.theme['primary-color']};
    font-size: ${(props) => props.theme['heading-m']};
    font-weight: 700;
  }

  img {
    filter: invert(39%) sepia(47%) saturate(748%) hue-rotate(203deg)
      brightness(94%) contrast(93%);
  }

  &:hover {
    background-color: ${(props) => `${props.theme['sidebar-btn-hover']}`};
    transition: 200ms;
    border-top-right-radius: 22px;
    border-bottom-right-radius: 22px;

    p {
      color: ${(props) => props.theme['primary-color']};
    }

    img {
      filter: invert(39%) sepia(47%) saturate(748%) hue-rotate(203deg)
        brightness(94%) contrast(93%);
    }
`

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
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
    font-size: ${(props) => props.theme['heading-m']};
    font-weight: 700;
    color: ${(props) => props.theme['subtitle-color']};
  }

  svg {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 1.3rem;
    margin-left: 1.5rem;
  }

  &:hover {
    background-color: ${(props) => `${props.theme['sidebar-btn-hover']}`};
    transition: 200ms;
    border-top-right-radius: 22px;
    border-bottom-right-radius: 22px;

    p {
      color: ${(props) => props.theme['primary-color']};
    }

    svg {
      filter: invert(39%) sepia(47%) saturate(748%) hue-rotate(203deg)
        brightness(94%) contrast(93%);
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
