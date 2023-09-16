import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: '0.8rem',
})

export const StatusBarContainer = styled('div', {
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
