import { styled } from '../../styles'

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
  width: 'clamp(300px, 90vw, 25rem)',
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
    color: '$red500',
  },
})

export const Description = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: '1.5rem',

  p: {
    color: '$gray400',
    fontSize: '0.8125rem',
    lineHeight: '1.4rem',
  },
})

export const ButtonsContainer = styled('div', {
  display: 'flex',
  marginTop: '1.5rem',
  flexDirection: 'column',
  width: '100%',
  gap: '1rem',
})
