import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { BaseModal } from '../BaseModal'
import {
  Body,
  CloseBtn,
  Divider,
  FieldGroup,
  Footer as FooterEl,
  FooterActions,
  FooterHint,
  HeaderIcon,
  HeaderTitles,
  Kbd,
  Section,
  SectionHint,
  SectionLabel,
  SheetHeader as SheetHeaderEl,
  SheetSubtitle,
  SheetTitle,
} from './styles'

interface SheetProps {
  isLoading?: boolean
  onClose: () => void
  children: ReactNode
}

function SheetRoot({ isLoading, onClose, children }: SheetProps) {
  return (
    <BaseModal
      isLoading={isLoading}
      onClose={onClose}
      hasHeader={false}
      padding="0"
      overflow="hidden"
    >
      {children}
    </BaseModal>
  )
}

interface SheetHeaderProps {
  icon: IconDefinition
  title: string
  subtitle?: ReactNode
  onClose: () => void
}

function Header({ icon, title, subtitle, onClose }: SheetHeaderProps) {
  return (
    <SheetHeaderEl>
      <HeaderIcon>
        <FontAwesomeIcon icon={icon} />
      </HeaderIcon>
      <HeaderTitles>
        <SheetTitle>{title}</SheetTitle>
        {subtitle && <SheetSubtitle>{subtitle}</SheetSubtitle>}
      </HeaderTitles>
      <CloseBtn onClick={onClose} aria-label="Close">
        <FontAwesomeIcon icon={faXmark} />
      </CloseBtn>
    </SheetHeaderEl>
  )
}

interface SheetFooterProps {
  /** Left-side hint. Defaults to an "Esc to close" affordance. */
  hint?: ReactNode
  /** Right-side actions (e.g. Cancel + submit buttons). */
  children: ReactNode
}

function Footer({ hint, children }: SheetFooterProps) {
  return (
    <FooterEl>
      <FooterHint>
        {hint ?? (
          <>
            <Kbd>Esc</Kbd>
            to close
          </>
        )}
      </FooterHint>
      <FooterActions>{children}</FooterActions>
    </FooterEl>
  )
}

/**
 * Compound "sheet" modal used by the create/edit forms (task, board).
 * Encapsulates the shared scaffolding — iconed header, scrollable sectioned
 * body, and a footer with hint + aligned actions — so each form only composes
 * its own fields.
 */
export const Sheet = Object.assign(SheetRoot, {
  Header,
  Body,
  Section,
  SectionLabel,
  SectionHint,
  Divider,
  FieldGroup,
  Footer,
})

export { Kbd } from './styles'
