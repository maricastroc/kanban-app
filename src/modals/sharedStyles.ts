import { styled } from '@/styles'

export const Overlay = styled('div', {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  inset: 0,
  zIndex: 9998,
  backgroundColor: 'rgba(10, 10, 10, 0.7)',
})

export const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '1.5rem',
  backgroundColor: '$gray600',
  border: 'none',
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(300px, 90vw, 33rem)',
  borderRadius: 8,
  zIndex: 9999,

  '&:focus': {
    boxShadow: 'none',
  },

  '&.bigger': {
    padding: '1.5rem 1.5rem 3rem',
    height: '90vh',
    overflowY: 'scroll',
  },
})

export const Title = styled('div', {
  fontSize: '1.125rem',
  fontWeight: 700,
  maxWidth: '100%',

  '&.delete': {
    color: '$red500',
  },
})

export const FormError = styled('p', {
  fontSize: '0.75rem',
  color: '$red500',
  fontWeight: 700,
})

export const FormContainer = styled('form', {
  display: 'flex',
  marginTop: '1.5rem',
  flexDirection: 'column',
  width: '100%',
  gap: '1.5rem',
})

export const InputContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginBottom: '0.7rem',
  width: '100%',
})

export const Label = styled('label', {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '$white',
  marginBottom: '0.7rem',
})

export const Input = styled('input', {
  pointerEvents: 'initial',
  opacity: 1,
  width: '100%',
  backgroundColor: '$gray600',
  border: 'solid 2px $gray500',
  padding: '0.7rem 1rem',
  color: '$white',
  fontSize: '0.8125rem',
  borderRadius: 4,

  '&.disabled': {
    pointerEvents: 'none',
    opacity: 0.5,
  },
})

export const TextArea = styled('textarea', {
  backgroundColor: '$gray600',
  border: 'solid 2px $gray500',
  padding: '0.7rem 1rem',
  lineHeight: '1.3rem',
  color: '$white',
  fontSize: '0.8125rem',
  borderRadius: 4,
  minHeight: 112,
  resize: 'none',
  width: '100%',
})

export const InputVariantsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',

  span: {
    marginTop: '0.3rem',
    display: 'block',
    color: '$red500',
    fontSize: '0.75rem',
    fontWeight: 700,
    left: '75%',
  },
})
