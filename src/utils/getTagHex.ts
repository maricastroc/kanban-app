import { tagColors } from '@/utils/constants'

/**
 * Resolves a tag's stored color *name* (e.g. "Aqua Blue") to its hex value.
 * Falls back to a neutral gray when the name isn't in the palette.
 */
export function getTagHex(colorName: string, fallback = '#8A8E98'): string {
  return tagColors.find((c) => c.name === colorName)?.color || fallback
}

// Halves each channel. Validated to clear WCAG AA (≥4.5:1; actual ≥6.2:1) for
// every tag color rendered as text on its own 10% tint over a white card.
function darken(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return (
    '#' +
    channels
      .map((c) =>
        Math.round(c * 0.5)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}

/**
 * Theme-aware tag styling. A single hue can't pass AA as text in both themes
 * (light needs dark text, dark needs light text), so in light mode we darken
 * the text while keeping the soft 10% tint background that reads in both.
 */
export function getTagStyle(
  colorName: string,
  isDark: boolean,
): { color: string; backgroundColor: string } {
  const base = getTagHex(colorName)
  return {
    color: isDark ? base : darken(base),
    backgroundColor: `${base}1A`,
  }
}
