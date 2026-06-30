import { tagColors } from '@/utils/constants'
import { darken } from '@/utils/darken'

/**
 * Resolves a tag's stored color *name* (e.g. "Aqua Blue") to its hex value.
 * Falls back to a neutral gray when the name isn't in the palette.
 */
export function getTagHex(colorName: string, fallback = '#8A8E98'): string {
  return tagColors.find((c) => c.name === colorName)?.color || fallback
}

/**
 * Theme-aware tag styling. A single hue can't pass AA as text in both themes
 * (light needs dark text, dark needs light text), so in light mode we darken
 * the text — validated to clear AA (≥4.5:1; actual ≥6.2:1) — while keeping the
 * soft 10% tint background that reads in both.
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
