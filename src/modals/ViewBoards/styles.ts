import { styled } from '@/styles'

import { Root as RadixRoot, Thumb as RadixThumb } from '@radix-ui/react-switch'

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
  padding: '1.5rem 0',
  backgroundColor: '$gray600',
  border: 'none',
  position: 'fixed',
  overflowX: 'hidden',
  overflowY: 'scroll',
  left: '50%',
  top: '50%',
  height: 'fit-content',
  maxHeight: '100vh',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(300px, 90vw, 320px)',
  borderRadius: 8,
  zIndex: 9999,

  '&:focus': {
    boxShadow: 'none',
  },
})

export const Title = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  padding: '0 1.5rem',
  width: '100%',

  h3: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '$gray400',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
})

export const Description = styled('div', {
  display: 'flex',
  marginTop: '1.5rem',
  flexDirection: 'column',
  width: '100%',
})

export const BoardsContainer = styled('div', {
  display: 'flex',
  marginTop: '1.5rem',
  flexDirection: 'column',
  width: '100%',
})

export const Board = styled('button', {
  cursor: 'pointer',
  display: 'flex',
  padding: '0.9rem 1.5rem',
  alignItems: 'center',
  justifyContent: 'flex-start',
  backgroundColor: 'transparent',
  border: 'none',
  gap: '0.75rem',
  width: '100%',

  p: {
    color: '$gray400',
    fontSize: '0.93rem',
    fontWeight: 700,
  },

  img: {
    color: '$gray400',
    fontSize: '1.5rem',
  },

  '&.active': {
    backgroundColor: '$purple500',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,

    p: {
      color: '$white',
    },

    img: {
      filter: 'brightness(1.5)',
    },
  },

  '&.create': {
    p: {
      color: '$purple500',
    },

    img: {
      filter:
        'invert(39%) sepia(47%) saturate(748%) hue-rotate(203deg) brightness(94%) contrast(93%)',
    },
  },

  '&:focus': {
    boxShadow: 'none',
  },
})

export const ThemeSwitcherContainer = styled('div', {
  margin: '1rem 1rem 0',
  backgroundColor: '$gray700',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  gap: '1.5rem',
  width: '90%',

  svg: {
    color: '$gray400',
    fontSize: '1.5rem',
  },
})

export const SwitchRoot = styled(RadixRoot, {
  cursor: 'pointer',
  width: 40,
  height: 20,
  backgroundColor: '$purple500',
  borderRadius: 9999,
  position: 'relative',
  boxShadow: 'none',
  border: 'none',
})

export const SwitchThumb = styled(RadixThumb, {
  position: 'absolute',
  width: 14,
  height: 14,
  borderRadius: '50%',
  backgroundColor: '$white',
  top: 3,
  transform: 'translateX(2px)',
  transition: 'transform 0.2s ease',

  '&[data-state="checked"]': {
    transform: 'translateX(-16px)',
  },
})
