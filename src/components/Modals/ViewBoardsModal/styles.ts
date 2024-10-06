import styled from 'styled-components'

import { Title as RadixTitle } from '@radix-ui/react-dialog'

import { Root as RadixRoot, Thumb as RadixThumb } from '@radix-ui/react-switch'

export const ModalTitle = styled(RadixTitle)`
  display: flex;
  justify-content: flex-start;
  padding: 0 1.5rem;
  width: 100%;
  font-size: ${(props) => props.theme['heading-s']};
  font-weight: 700;
  color: ${(props) => props.theme['subtitle-color']};
  text-transform: uppercase;
  letter-spacing: 1.2px;
`

export const BoardsContainer = styled.div`
  display: flex;
  margin-top: 1.5rem;
  flex-direction: column;
  width: 100%;
`

export const BoardItem = styled.button`
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

export const ThemeSwitcherContainer = styled.div`
  background-color: ${(props) => props.theme['bg-color']};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  gap: 1.5rem;
  width: 85%;
  margin: 1rem auto 0;

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
