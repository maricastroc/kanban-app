import styled from 'styled-components'
import { Root as RadixRoot, Thumb as RadixThumb } from '@radix-ui/react-switch'

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
    width: 30px;
    height: 30px;
    border-radius: 9px;
    background: ${(props) => props.theme['accent-color']};
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      color: ${(props) => props.theme['accent-on']};
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

export const BoardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  gap: 1px;
  padding: 0 0.6rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
`

export const EmptyBoardsHint = styled.p`
  padding: 0.4rem 0.65rem 0.75rem;
  font-size: 0.76rem;
  line-height: 1.4;
  color: ${(props) => props.theme['muted-color']};
`

export const CreateBoardArea = styled.div`
  flex-shrink: 0;
  width: 100%;
  padding: 0 0.6rem;
`

export const BoardIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  flex-shrink: 0;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`

export const BoardButton = styled.button`
  cursor: pointer;
  position: relative;
  display: flex;
  padding: 0.6rem 0.65rem;
  align-items: center;
  border-radius: 8px;
  background-color: transparent;
  border: none;
  gap: 0.6rem;
  width: 100%;
  text-align: left;
  color: ${(props) => props.theme['subtitle-color']};
  transition: background-color 160ms, color 160ms;

  svg {
    font-size: 0.95rem;
    flex-shrink: 0;
    color: ${(props) => props.theme['muted-color']};
  }

  p {
    flex: 1;
    min-width: 0;
    font-size: 0.82rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: inherit;
  }

  .count {
    font-size: 0.68rem;
    font-weight: 600;
    color: ${(props) => props.theme['muted-color']};
  }

  &:hover {
    background-color: ${(props) => props.theme['hairline-color']};
    color: ${(props) => props.theme['text-color']};
  }

  &.active {
    background-color: ${(props) => props.theme['accent-soft']};
    color: ${(props) => props.theme['accent-text']};

    svg {
      color: ${(props) => props.theme['accent-color']};
    }

    .count {
      color: ${(props) => props.theme['accent-color']};
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 16px;
      width: 2px;
      border-radius: 0 2px 2px 0;
      background-color: ${(props) => props.theme['accent-color']};
    }
  }

  &:focus-visible {
    outline-offset: -2px;
  }
`

export const CreateDivider = styled.div`
  height: 1px;
  margin: 0.45rem 0.5rem;
  background-color: ${(props) => props.theme['hairline-color']};
`

export const CreateBoardButton = styled.button`
  cursor: pointer;
  display: flex;
  padding: 0.6rem 0.65rem;
  align-items: center;
  border-radius: 8px;
  background-color: transparent;
  border: none;
  gap: 0.6rem;
  width: 100%;
  text-align: left;
  color: ${(props) => props.theme['accent-color']};
  transition: background-color 160ms;

  .plus-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    border-radius: 6px;
    background-color: ${(props) => props.theme['accent-soft']};
  }

  svg {
    font-size: 0.8rem;
    color: ${(props) => props.theme['accent-color']};
  }

  p {
    font-size: 0.82rem;
    font-weight: 600;
    color: ${(props) => props.theme['accent-color']};
  }

  &:hover {
    background-color: ${(props) => props.theme['accent-soft']};
  }
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

export const ThemeSwitcherContainer = styled.div`
  background-color: ${(props) => props.theme['panel-color']};
  border: 1px solid ${(props) => props.theme['hairline-color']};
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
  gap: 1rem;

  svg {
    color: ${(props) => props.theme['muted-color']};
    font-size: 1rem;
  }
`

export const SwitchRoot = styled(RadixRoot)`
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 38px;
  height: 20px;
  padding: 0;
  background-color: ${(props) => props.theme['accent-color']};
  border-radius: 9999px;
  position: relative;
  box-shadow: none;
  border: none;
  flex-shrink: 0;
  transition: background-color 200ms ease;

  &:hover {
    background-color: ${(props) => props.theme['accent-hover']};
  }
`

export const SwitchThumb = styled(RadixThumb)`
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #ffffff;
  transform: translateX(3px);
  transition: transform 0.2s ease;
  will-change: transform;

  &[data-state='checked'] {
    transform: translateX(21px);
  }
`
