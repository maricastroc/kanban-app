import { createStitches } from '@stitches/react'

export const {
  config,
  styled,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  css,
} = createStitches({
  theme: {
    colors: {
      white: '#FFFFFF',

      purple500: '#635FC7',
      purple300: '#A8A4FF',

      red500: '#EA5555',
      red300: '#FF9898',

      gray200: '#F4F7FD',
      gray300: '#E4EBFA',
      gray400: '#828FA3',
      gray500: '#3E3F4E',
      gray600: '#2B2C37',
      gray700: '#20212C',
      gray800: '#000112',

      tagColor1: '#49C4E5',
      tagColor2: '#8471F2',
      tagColor3: '#67E2AE',
      tagColor4: '#e5a449',
      tagColor5: '#2a3fdb',
      tagColor6: '#c36e6e',
    },
    fontSizes: {
      ft_h1: '3.5rem',
      ft_h2: '2.5rem',
      ft_h3: '2rem',
      ft_h4: '1.75rem',
      ft_h5: '1.5rem',
      ft_h6: '1.125rem',
      ft_body: '0.93rem',
      ft_overline: '0.875rem',
      ft_subtitle: '0.8125rem',
    },
  },
})
