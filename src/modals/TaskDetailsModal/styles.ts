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
  padding: '1.5rem 1.5rem 3rem',
  backgroundColor: '$gray600',
  border: 'none',
  position: 'fixed',
  left: '50%',
  overflowY: 'scroll',
  overflowX: 'hidden',
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

export const Title = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',

  h3: {
    fontSize: '1.125rem',
    fontWeight: 700,
    maxWidth: '85%',
  },
})

export const Description = styled('div', {
  display: 'flex',
  marginTop: '1.5rem',
  flexDirection: 'column',
  width: '100%',

  p: {
    color: '$gray400',
    fontSize: '0.8125rem',
    lineHeight: '1.4rem',
  },
})

export const SubtasksContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginTop: '1rem',
})

export const SubtasksTitle = styled('strong', {
  fontSize: '0.75rem',
  color: '$white',
  fontWeight: 700,
  marginTop: '1.5rem',
})

export const CurrentStatusTitle = styled('strong', {
  fontSize: '0.75rem',
  color: '$white',
  fontWeight: 700,
  marginTop: '1.5rem',
})

export const OptionsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
})

export const OptionsButton = styled('button', {
  cursor: 'pointer',
  display: 'flex',
  backgroundColor: 'transparent',
  border: 'none',
  padding: '0.5rem',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',

  svg: {
    cursor: 'pointer',
    color: '$gray400',
    fontSize: '1.5rem',
  },

  '&:hover': {
    backgroundColor: '$gray700',
    transition: '200ms',
  },
})

export const OptionsModal = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '1.2rem',
  borderRadius: 8,
  position: 'absolute',
  gap: '0.7rem',
  top: '2.2rem',
  right: 0,
  width: '10rem',
  backgroundColor: '$gray700',

  button: {
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1rem',

    '&.edit': {
      color: '$red500',
    },

    '&.delete': {
      color: '$gray400',
    },
  },
})
