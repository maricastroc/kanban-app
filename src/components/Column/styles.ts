import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  alignItems: 'flex-start',
  minWidth: '17.5rem',
  maxWidth: '17.5rem',
  width: '100%',
})

export const TagContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',

  span: {
    width: 15,
    height: 15,
    backgroundColor: '$tagColor1',
    borderRadius: '50%',
  },

  strong: {
    color: '$gray400',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: '0.75rem',
  },
})

export const TasksContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  width: '100%',
})

export const TaskItem = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  padding: '1.5rem 1rem',
  borderRadius: 8,
  backgroundColor: '$gray600',
  width: '100%',
  alignItems: 'flex-start',

  strong: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '$white',
    lineHeight: '1.3rem',
  },

  p: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '$gray400',
  },

  '&:hover': {
    filter: 'brightness(0.9)',
    transition: '200ms',

    strong: {
      filter: 'brightness(0.7)',
    },

    p: {
      filter: 'brightness(0.7)',
    },
  },
})
