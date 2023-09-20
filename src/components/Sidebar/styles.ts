import { styled } from '@/styles'
import { Root as RadixRoot, Thumb as RadixThumb } from '@radix-ui/react-switch'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRight: 'solid 1px $gray500',
  minWidth: 260,
  backgroundColor: '$gray600',
})

export const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
})

export const Title = styled('h3', {
  display: 'flex',
  justifyContent: 'flex-start',
  padding: '1.875rem 1.5rem 0',
  width: '100%',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '$gray400',
  textTransform: 'uppercase',
  letterSpacing: 1.5,
})

export const BoardsContainer = styled('div', {
  display: 'flex',
  marginTop: '1.25rem',
  flexDirection: 'column',
  width: '100%',
  paddingRight: '1.5rem',
  gap: '0.5rem',
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
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,

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

    '&:hover': {
      backgroundColor: 'transparent',

      img: {
        filter:
          'invert(39%) sepia(47%) saturate(748%) hue-rotate(203deg) brightness(130%) contrast(93%)',
      },

      p: {
        color: '$purple300',
        transition: '200ms',
      },
    },
  },

  '&:focus': {
    boxShadow: 'none',
  },

  '&:hover': {
    backgroundColor: '$white',
    transition: '200ms',
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,

    p: {
      color: '$purple500',
    },

    img: {
      filter:
        'invert(39%) sepia(47%) saturate(748%) hue-rotate(203deg) brightness(94%) contrast(93%)',
    },
  },
})

export const OptionsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '1rem',
})

export const HideButton = styled('button', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '0.65rem',
  padding: '0.7rem',
  backgroundColor: 'transparent',
  border: 'none',
  paddingLeft: '1.5rem',
  marginBottom: '2rem',
  width: '90%',
  borderTopRightRadius: 22,
  borderBottomRightRadius: 22,

  p: {
    fontSize: '0.93rem',
    fontWeight: 700,
    color: '$gray400',
  },

  svg: {
    color: '$gray400',
    fontSize: '1.3rem',
    marginLeft: '1.5rem',
  },

  '&:hover': {
    backgroundColor: '$white',
    transition: '200ms',

    p: {
      color: '$purple500',
    },
  },

  '@media (min-width: 1024px)': {
    paddingLeft: '0.5rem',
  },
})

export const ThemeSwitcherContainer = styled('div', {
  backgroundColor: '$gray700',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  gap: '1.5rem',
  width: '85%',
  margin: '0 auto',

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

  '&:hover': {
    backgroundColor: '$purple300',
    transition: '200ms',
  },
})

export const SwitchThumb = styled(RadixThumb, {
  position: 'absolute',
  width: 14,
  height: 14,
  borderRadius: '50%',
  backgroundColor: '$white',
  top: 3,
  transform: 'translateX(-16px)',
  transition: 'transform 0.2s ease',

  '&[data-state="checked"]': {
    transform: 'translateX(2px)',
  },
})
