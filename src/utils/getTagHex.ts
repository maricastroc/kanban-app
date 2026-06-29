import { tagColors } from '@/utils/constants'

/**
 * Resolves a tag's stored color *name* (e.g. "Aqua Blue") to its hex value.
 * Falls back to a neutral gray when the name isn't in the palette.
 */
export function getTagHex(colorName: string, fallback = '#8A8E98'): string {
  return tagColors.find((c) => c.name === colorName)?.color || fallback
}
