import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  width: '100%',
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

  '&.disabled': {
    pointerEvents: 'none',
    color: '$gray400',
  },
})

export const RemoveButton = styled('button', {
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
