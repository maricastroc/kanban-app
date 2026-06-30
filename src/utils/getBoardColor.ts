import { darken } from '@/utils/darken'

// Deterministic per-board color so each board reads as its own space (identity)
const BOARD_COLORS = [
  '#14B8A6',
  '#3B82F6',
  '#E8638F',
  '#E0A53B',
  '#8B5CF6',
  '#22C55E',
  '#F0795B',
  '#56C7E8',
]

export const getBoardColor = (name: string) => {
  const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return BOARD_COLORS[sum % BOARD_COLORS.length]
}

/**
 * Theme-aware board avatar. The soft tint + full-color initial reads in dark
 * mode, but in light mode it both collides with the (teal) active-tab highlight
 * and fails contrast on the initial — so light mode uses a solid darkened chip
 * with a white initial, which separates cleanly from the sidebar and the tab.
 */
export const getBoardAvatarStyle = (name: string, isDark: boolean) => {
  const base = getBoardColor(name)
  return isDark
    ? { backgroundColor: `${base}22`, color: base }
    : { backgroundColor: darken(base), color: '#FFFFFF' }
}
