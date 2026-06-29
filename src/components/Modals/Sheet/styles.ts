import styled from 'styled-components'
import { Title as RadixTitle } from '@radix-ui/react-dialog'

/**
 * Shared "sheet" modal layout primitives.
 * Used by TaskFormModal and BoardFormModal so both belong to the same system:
 * iconed header + subtitle, scrollable body split into divided sections,
 * and a consistent footer with hint + aligned actions.
 */

export const SheetHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  width: 100%;
  flex-shrink: 0;
  padding: 2rem 1.5rem 1.2rem;
`

export const HeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 11px;
  background-color: ${(props) => props.theme['accent-soft']};
  color: ${(props) => props.theme['accent-color']};
  font-size: 0.95rem;
`

export const HeaderTitles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
  min-width: 0;
`

export const SheetTitle = styled(RadixTitle)`
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${(props) => props.theme['title-color']};
`

export const SheetSubtitle = styled.p`
  font-size: 0.78rem;
  color: ${(props) => props.theme['muted-color']};
  line-height: 1.35;
`

export const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: ${(props) => props.theme['muted-color']};
  transition: background-color 140ms ease, color 140ms ease;

  svg {
    font-size: 1.05rem;
  }

  &:hover {
    background-color: ${(props) => props.theme['hairline-color']};
    color: ${(props) => props.theme['title-color']};
  }
`

export const Body = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
  padding: 0.3rem 1.5rem 1.4rem;
`

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  width: 100%;
`

export const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${(props) => props.theme['muted-color']};
  margin-bottom: 0.1rem;

  svg {
    font-size: 0.72rem;
  }
`

export const SectionHint = styled.p`
  font-size: 0.74rem;
  line-height: 1.4;
  color: ${(props) => props.theme['muted-color']};
  margin-top: -0.7rem;
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme['hairline-color']};
  margin: 1.3rem 0;
`

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  span {
    margin-top: 0.35rem;
    display: block;
    color: ${(props) => props.theme['error-color']};
    font-size: 0.72rem;
    font-weight: 500;
  }
`

/** Dashed "composer" button — add subtask / add column. */
export const DashedComposerBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  cursor: pointer;
  background: transparent;
  border: 1px dashed ${(props) => props.theme['hairline-strong']};
  border-radius: 9px;
  padding: 0.7rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${(props) => props.theme['muted-color']};
  transition: border-color 160ms ease, color 160ms ease,
    background-color 160ms ease;

  svg {
    font-size: 0.75rem;
  }

  &:hover {
    border-color: ${(props) => props.theme['accent-color']};
    color: ${(props) => props.theme['accent-text']};
    background-color: ${(props) => props.theme['accent-soft']};
  }
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  flex-shrink: 0;
  padding: 0.9rem 1.5rem;
  border-top: 1px solid ${(props) => props.theme['hairline-color']};
  background-color: ${(props) => props.theme['card-color']};
`

export const FooterHint = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: ${(props) => props.theme['muted-color']};

  @media (max-width: 480px) {
    display: none;
  }
`

export const Kbd = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 5px;
  background-color: ${(props) => props.theme['kbd-bg']};
  border: 1px solid ${(props) => props.theme['hairline-color']};
  font-size: 0.66rem;
  font-weight: 600;
  color: ${(props) => props.theme['muted-color']};

  &.onAccent {
    background-color: rgba(0, 0, 0, 0.18);
    border-color: transparent;
    color: inherit;
  }
`

export const FooterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`
