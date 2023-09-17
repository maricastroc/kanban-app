import { styled } from '@/styles'

export const Overlay = styled('div', {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  inset: 0,
  zIndex: 9998,
  backgroundColor: 'rgba(10, 10, 10, 0.7)',
  overflow: 'auto',
})

export const Content = styled('div', {
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

  '&:focus': {
    boxShadow: 'none',
  },
})

export const Title = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  width: '100%',

  h3: {
    fontSize: '1.125rem',
    fontWeight: 700,
    maxWidth: '80%',
  },
})

export const Description = styled('div', {
  display: 'flex',
  marginTop: '1.5rem',
  flexDirection: 'column',
  width: '100%',
})

export const FormContainer = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
})

export const InputContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.3rem',
  width: '100%',
})

export const Label = styled('label', {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '$white',
  marginBottom: '0.3rem',
})

export const Input = styled('input', {
  width: '100%',
  backgroundColor: '$gray600',
  border: 'solid 1px $gray500',
  padding: '0.7rem 1rem',
  color: '$white',
  fontSize: '0.8125rem',
  borderRadius: 4,

  '&.error': {
    border: 'solid 2px $red500',
  },
})

export const ColumnsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
  marginTop: '1rem',
})

export const ColumnsContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginBottom: '1rem',
})

export const InputColumnsContainer = styled('div', {
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

export const InputColumnContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  width: '100%',
})

export const InputColumn = styled('input', {
  position: 'relative',
  width: '100%',
  backgroundColor: '$gray600',
  border: 'solid 1px $gray500',
  padding: '0.7rem 1rem',
  color: '$white',
  fontSize: '0.8125rem',
  borderRadius: 4,

  '&.error': {
    border: 'solid 2px $red500',
  },
})

export const RemoveColumnButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: 'none',
  pointerEvents: 'initial',

  svg: {
    fontSize: '1.5rem',
    color: '$gray400',
  },

  '&.disabled': {
    cursor: 'not-allowed',
    pointerEvents: 'none',

    svg: {
      opacity: 0.2,
    },
  },
})

export const FormError = styled('p', {
  fontSize: '0.75rem',
  color: '$red500',
  fontWeight: 700,
})
