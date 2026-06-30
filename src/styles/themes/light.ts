import { baseFontSizes } from './base'

/**
 * Light theme — designed as its own product, not an inversion of dark.
 *
 * Surface model (mirrors the *relationships* in dark.ts, but elevation reads
 * through WHITENESS + soft slate shadows + hairlines instead of tone alone):
 *
 *   canvas  #EBEDF2  ── recessed page + board surface (clearly not white)
 *   sidebar #F4F5F8  ┐
 *   panel   #F4F5F8  ┘  chrome rail / column panels, one step up + hairline
 *   card    #FFFFFF  ── elevated content, the brightest surface + shadow
 *
 * Shadows are layered and tinted toward cool slate (never pure black) so depth
 * appears without visual noise. References: Linear / Attio / Notion / GitHub.
 */
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

  // --- borders / hairlines (cool slate base, not muddy pure-black) ---
  'border-color': 'rgba(16, 24, 40, 0.10)',
  'hairline-color': 'rgba(16, 24, 40, 0.08)',
  'hairline-strong': 'rgba(16, 24, 40, 0.14)',

  'cards-color': '#FFFFFF',
  'bg-color': '#EBEDF2',
  'scroll-color': '#C4C7CE',

  'light-bg-color': '#EAECF1',

  // --- redesign surfaces & accents (C2 / teal) ---
  'canvas-color': '#EBEDF2',
  'sidebar-color': '#F4F5F8',
  'panel-color': '#F4F5F8',
  'card-color': '#FFFFFF',
  // hover-fill for menu items / buttons / rows that sit on a white surface
  'card-hover': '#EDEFF3',
  // surface a card rises to on hover/drag — stays crisp white, shadow lifts it
  'card-lift': '#FFFFFF',
  'field-bg': '#ECEEF2',

  // --- layered elevation system (soft, slate-tinted) ---
  'shadow-xs': '0 1px 2px rgba(16, 24, 40, 0.06)',
  'shadow-sm':
    '0 2px 4px rgba(16, 24, 40, 0.05), 0 6px 16px rgba(16, 24, 40, 0.08)',
  'shadow-md':
    '0 4px 8px rgba(16, 24, 40, 0.06), 0 12px 28px rgba(16, 24, 40, 0.12)',
  'shadow-lg':
    '0 12px 24px rgba(16, 24, 40, 0.10), 0 32px 64px rgba(16, 24, 40, 0.18)',
  // back-compat alias (kept equal to shadow-sm)
  'card-shadow':
    '0 2px 4px rgba(16, 24, 40, 0.05), 0 6px 16px rgba(16, 24, 40, 0.08)',

  // scrim behind modals / loading — airy slate, not heavy black
  'overlay-color': 'rgba(17, 24, 39, 0.30)',

  'muted-color': '#8A8E98',
  'accent-color': '#0D9488',
  'accent-hover': '#0F766E',
  'accent-soft': 'rgba(13, 148, 136, 0.12)',
  'accent-text': '#0F766E',
  'accent-on': '#FFFFFF',
  'accent-glow': 'rgba(13, 148, 136, 0.22)',
  // exclusive secondary signature accent (rose) — used sparingly for identity
  'accent-2': '#D6477A',
  'accent-2-soft': 'rgba(214, 71, 122, 0.10)',
  'kbd-bg': 'rgba(16, 24, 40, 0.05)',

  ...baseFontSizes,
}
