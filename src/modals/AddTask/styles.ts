import { styled } from '@/styles'

export const StatusBarContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
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

export const SubtasksContent = styled('p', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginBottom: '1rem',
})
