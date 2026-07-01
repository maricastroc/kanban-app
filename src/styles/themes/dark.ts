import { baseFontSizes } from './base'

export const darkTheme = {
  'title-color': '#F4F5F7',

  'primary-color': '#1AA294',
  'primary-hover': '#2BBEAF',

  'border-btn-color': '#1AA294',

  'tags-btn-color': '#2BBEAF',

  'secondary-color': '#16161B',
  'secondary-hover': '#1F1F26',

  'tertiary-hover': '#2BBEAF',

  'action-btn-color': '#E7E7EA',
  'action-btn-hover': '#2BBEAF',

  'sidebar-btn-color': '#1AA294',
  'sidebar-btn-hover': 'rgba(26, 162, 148, 0.13)',

  'error-color': '#E5484D',
  'error-hover': '#FF6166',
  // softened error states for a more premium, less aggressive look
  'error-text': '#D97375',
  'error-border': 'rgba(229, 72, 77, 0.35)',
  'error-soft': 'rgba(229, 72, 77, 0.06)',

  'button-title': '#04201C',

  'text-color': '#C7CAD1',
  'select-color': '#16161B',

  'paragraph-color': '#C7CAD1',
  'details-color': '#8A8E98',
  'subtitle-color': '#878B95',
  'border-color': 'rgba(255, 255, 255, 0.08)',
  'cards-color': '#16161B',
  'bg-color': '#0A0A0C',
  'scroll-color': '#2A2A30',

  'light-bg-color': '#16161B',

  'completed-color': '#2FB48A',
  'overdue-color': '#C95C57',
  'due-soon-color': '#E0A53B',

  // --- redesign surfaces & accents (C2 / teal) ---
  'canvas-color': '#0A0A0C',
  'sidebar-color': '#0D0D11',
  'panel-color': '#0D0D11',
  'card-color': '#17181D',
  // hover-fill for menu items / buttons / rows on an elevated surface
  'card-hover': '#1E1F26',
  // surface a card rises to on hover/drag (brightens, as elevation = lighter)
  'card-lift': '#1E1F26',
  'field-bg': '#131317',

  // --- layered elevation system (kept strong/black for the dark canvas) ---
  'shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.30)',
  'shadow-sm': '0 6px 18px rgba(0, 0, 0, 0.34)',
  'shadow-md': '0 12px 28px rgba(0, 0, 0, 0.45)',
  'shadow-lg': '0 30px 90px rgba(0, 0, 0, 0.55)',
  // back-compat alias (kept equal to shadow-sm)
  'card-shadow': '0 6px 18px rgba(0, 0, 0, 0.34)',

  // scrim behind modals / loading
  'overlay-color': 'rgba(6, 6, 8, 0.6)',
  'muted-color': '#6A6D77',
  'hairline-color': 'rgba(255, 255, 255, 0.06)',
  'hairline-strong': 'rgba(255, 255, 255, 0.11)',
  'accent-color': '#1AA294',
  'accent-hover': '#2BBEAF',
  'accent-soft': 'rgba(26, 162, 148, 0.13)',
  'accent-text': '#74D6C7',
  'accent-on': '#04201C',
  'accent-glow': 'rgba(26, 162, 148, 0.26)',
  // exclusive secondary signature accent (rose) — used sparingly for identity
  'accent-2': '#E8638F',
  'accent-2-soft': 'rgba(232, 99, 143, 0.14)',
  'kbd-bg': 'rgba(255, 255, 255, 0.07)',

  ...baseFontSizes,
}
