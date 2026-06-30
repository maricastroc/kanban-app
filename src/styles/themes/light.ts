import { baseFontSizes } from './base'

export const lightTheme = {
  'title-color': '#15161A',

  'primary-color': '#0D9488',
  'primary-hover': '#0F766E',

  'secondary-color': '#EAF6F4',
  'secondary-hover': '#D7EFEB',

  'tags-btn-color': '#0D9488',

  'tertiary-hover': '#0F766E',

  'sidebar-btn-color': '#0D9488',
  'sidebar-btn-hover': 'rgba(13, 148, 136, 0.10)',

  'action-btn-color': '#15161A',
  'action-btn-hover': '#0F766E',

  'error-color': '#D93A3F',
  'error-hover': '#B82E33',
  // softened error states for a more premium, less aggressive look
  'error-text': '#C0383C',
  'error-border': 'rgba(217, 58, 63, 0.32)',
  'error-soft': 'rgba(217, 58, 63, 0.05)',

  'button-title': '#FFFFFF',

  'border-btn-color': '#0D9488',

  'text-color': '#3A3D45',
  'select-color': '#15161A',

  'completed-color': '#0E9F73',
  'overdue-color': '#C44A46',
  'due-soon-color': '#C98A1E',

  'paragraph-color': '#5A5E68',

  'details-color': '#6A6E78',
  'subtitle-color': '#6A6E78',
  'border-color': 'rgba(0, 0, 0, 0.09)',
  'cards-color': '#FFFFFF',
  'bg-color': '#F6F7F9',
  'scroll-color': '#C4C7CE',

  'light-bg-color': '#EEF0F2',

  // --- redesign surfaces & accents (C2 / teal) ---
  'canvas-color': '#F6F7F9',
  'sidebar-color': '#FFFFFF',
  'panel-color': '#F1F2F4',
  'card-color': '#FFFFFF',
  'card-hover': '#FBFCFD',
  'field-bg': '#F1F2F4',
  'card-shadow': '0 6px 16px rgba(15, 23, 42, 0.10)',
  'muted-color': '#8A8E98',
  'hairline-color': 'rgba(0, 0, 0, 0.07)',
  'hairline-strong': 'rgba(0, 0, 0, 0.12)',
  'accent-color': '#0D9488',
  'accent-hover': '#0F766E',
  'accent-soft': 'rgba(13, 148, 136, 0.10)',
  'accent-text': '#0F766E',
  'accent-on': '#FFFFFF',
  'accent-glow': 'rgba(13, 148, 136, 0.22)',
  // exclusive secondary signature accent (rose) — used sparingly for identity
  'accent-2': '#D6477A',
  'accent-2-soft': 'rgba(214, 71, 122, 0.10)',
  'kbd-bg': 'rgba(0, 0, 0, 0.05)',

  ...baseFontSizes,
}
