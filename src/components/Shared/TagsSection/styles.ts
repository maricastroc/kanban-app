import styled, { css, keyframes } from 'styled-components'

const hexToRgba = (hex: string, alpha: number) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// white on most chips, dark on light colors (yellow/pink) where white fails
const readableText = (hex: string) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.62 ? '#1A1A20' : '#FFFFFF'
}

const pop = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

export const TagsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.75rem;
`

export const TagsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

export const TagsLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${(props) => props.theme['muted-color']};

  svg {
    font-size: 0.72rem;
  }
`

export const TagsHint = styled.p`
  font-size: 0.73rem;
  line-height: 1.4;
  color: ${(props) => props.theme['muted-color']};
  opacity: 0.8;
`

export const ChipsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  width: 100%;
`

export const Chip = styled.button<{ $color: string; $checked: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease,
    color 150ms ease, box-shadow 150ms ease, transform 120ms ease;

  ${({ $checked, $color, theme }) =>
    $checked
      ? css`
          background-color: ${$color};
          border-color: ${$color};
          color: ${readableText($color)};
          box-shadow: 0 2px 10px ${hexToRgba($color, 0.32)};
        `
      : css`
          background-color: transparent;
          border-color: ${theme['hairline-strong']};
          color: ${theme['text-color']};

          &:hover {
            border-color: ${hexToRgba($color, 0.55)};
            background-color: ${hexToRgba($color, 0.1)};
          }
        `}

  &:active {
    transform: scale(0.96);
  }
`

export const ChipDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
`

export const ChipCheck = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: inherit;
  animation: ${pop} 160ms ease;

  svg {
    font-size: 0.7rem;
  }
`

export const Empty = styled.span`
  color: ${(props) => props.theme['muted-color']};
  font-size: 0.78rem;
`
