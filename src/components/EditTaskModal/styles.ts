import { styled } from '../../styles'

import {
  Overlay as RadixOverlay,
  Content as RadixContent,
  Title as RadixTitle,
  Description as RadixDescription,
  Close as RadixClose,
} from '@radix-ui/react-dialog'

export const Overlay = styled(RadixOverlay, {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  inset: 0,
  zIndex: 9998,
  backgroundColor: 'rgba(10, 10, 10, 0.7)',
  overflow: 'auto',
})

export const Content = styled(RadixContent, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '2rem 1.5rem 3rem',
  backgroundColor: '$gray600',
  border: 'none',
  position: 'fixed',
  left: '50%',
  overflowY: 'scroll',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(300px, 90vw, 33rem)',
  borderRadius: 8,
  zIndex: 9999,
  height: '90vh',

  '&:focus': {
    boxShadow: 'none',
  },
})

export const Title = styled(RadixTitle, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',

  h3: {
    fontSize: '1.125rem',
    fontWeight: 700,
    maxWidth: '80%',
  },

  svg: {
    color: '$gray400',
    fontSize: '1.5rem',
  },
})

export const Description = styled(RadixDescription, {
  display: 'flex',
  marginTop: '1.5rem',
  flexDirection: 'column',
  width: '100%',
})

export const FormContainer = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
})

export const InputContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',

  label: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '$white',
  },

  input: {
    backgroundColor: '$gray600',
    border: 'solid 2px $gray500',
    padding: '0.7rem 1rem',
    color: '$white',
    fontSize: '0.8125rem',
    borderRadius: 4,
  },

  textarea: {
    backgroundColor: '$gray600',
    border: 'solid 2px $gray500',
    padding: '0.7rem 1rem',
    lineHeight: '1.3rem',
    color: '$white',
    fontSize: '0.8125rem',
    borderRadius: 4,
    minHeight: 112,
    resize: 'none',
  },
})

export const CloseButton = styled(RadixClose, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',

  '&:focus': {
    boxShadow: 'none',
  },

  svg: {
    color: '$gray400',
    fontSize: '1.5rem',
  },
})

export const StatusBarContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

export const StatusBarTitle = styled('p', {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '$white',
  marginBottom: '0.5rem',
})

export const StatusBarContent = styled('div', {
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.5rem 1rem',
  backgroundColor: 'transparent',
  border: 'solid 2px $gray500',
  borderRadius: 8,

  '&.active': {
    border: 'solid 2px $purple500',
  },

  p: {
    fontSize: '0.8125rem',
    color: '$white',
  },

  svg: {
    color: '$purple500',
    fontSize: '1rem',
  },
})

export const OptionsContainer = styled('div', {
  marginTop: '0.7rem',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '1rem',
  backgroundColor: '$gray700',
  borderRadius: 8,
  gap: '0.9rem',

  button: {
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '0.8125rem',
    color: '$gray400',

    '&:focus': {
      boxShadow: 'none',
    },

    '&:hover': {
      color: '$white',
      fontWeight: 700,
    },
  },
})

export const SubtasksContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
})

export const SubtasksTitle = styled('p', {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '$white',
  marginBottom: '0.5rem',
})

export const SubtasksContent = styled('p', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})

export const SubtaskInputContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: '1rem',

  input: {
    width: '100%',
    backgroundColor: '$gray600',
    border: 'solid 2px $gray500',
    padding: '0.7rem 1rem',
    color: '$white',
    fontSize: '0.8125rem',
    borderRadius: 4,
  },

  button: {
    backgroundColor: 'transparent',
    border: 'none',

    svg: {
      color: '$gray400',
      fontSize: '1.3rem',
    },
  },
})

export const AddSubtaskButton = styled('button', {
  cursor: 'pointer',
  width: '100%',
  backgroundColor: '$white',
  color: '$purple500',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 12,
  padding: '0.7rem',
  fontSize: '0.8125rem',
  fontWeight: 700,
  marginTop: '0.8125rem',
  marginBottom: '0.65rem',
  border: 'none',

  '&:focus': {
    boxShadow: 'none',
  },

  '&:hover': {
    filter: 'brightness(0.8)',
    transition: '200ms',
  },
})

export const EditTaskButton = styled('button', {
  cursor: 'pointer',
  width: '100%',
  backgroundColor: '$purple500',
  color: '$white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 12,
  padding: '0.7rem',
  fontSize: '0.8125rem',
  fontWeight: 700,
  marginTop: '0.8125rem',
  border: 'none',

  '&:focus': {
    boxShadow: 'none',
  },

  '&:hover': {
    filter: 'brightness(1.2)',
    transition: '200ms',
  },
})

export const FormError = styled('p', {
  fontSize: '0.75rem',
  color: '$red500',
  fontWeight: 700,
})
