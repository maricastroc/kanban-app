import { styled } from '@/styles'

export const Container = styled('button', {
  cursor: 'pointer',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 12,
  padding: '0.7rem',
  border: 'none',

  '&.primary': {
    backgroundColor: '$white',

    p: {
      color: '$purple500',
    },
  },

  '&.secondary': {
    backgroundColor: '$purple500',

    p: {
      color: '$white',
    },
  },

  '&.tertiary': {
    backgroundColor: '$red500',

    p: {
      color: '$white',
    },
  },

  p: {
    fontSize: '0.8125rem',
    fontWeight: 700,
  },

  '&:focus': {
    boxShadow: 'none',
  },

  '&:hover': {
    filter: 'brightness(1.2)',
    transition: '200ms',
  },

  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',
      },
    },
  },
})
