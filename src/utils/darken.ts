/**
 * Halves each channel of a `#rrggbb` hex. Used to derive a darker variant of a
 * brand/tag/board color that stays legible (WCAG AA) in light mode — either as
 * text on its own light tint, or as a solid chip background under white text.
 */
export function darken(hex: string): string {
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
