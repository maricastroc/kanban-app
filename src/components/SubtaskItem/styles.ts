import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '1rem',
  backgroundColor: '$gray700',
  borderRadius: 8,
  padding: '0.85rem',
})

export const Title = styled('p', {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '$white',

  '&.checked': {
    color: '$white',
    opacity: 0.7,
    textDecoration: 'line-through',
  },

  '&.unchecked': {
    color: '$white',
    opacity: 1,
    textDecoration: 'none',
  },
})

export const UncheckedBox = styled('button', {
  cursor: 'pointer',
  minWidth: 16,
  minHeight: 16,
  backgroundColor: '$gray600',
  border: 'solid 1px $gray500',
  borderRadius: 3,

  '&:focus': {
    boxShadow: 'none',
  },
})

export const CheckedBox = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  minWidth: 16,
  minHeight: 16,
  backgroundColor: '$purple500',
  border: 'none',
  borderRadius: 3,

  svg: {
    color: '$white',
    fontSize: '0.7rem',
  },

  '&:focus': {
    boxShadow: 'none',
  },
})
