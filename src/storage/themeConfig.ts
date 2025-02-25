const THEME_STORAGE = '@kanban:themes'

function getParsedTheme(storageKey: string, defaultValue: string) {
  if (typeof window === 'undefined') return defaultValue

  const savedData = localStorage.getItem(storageKey)
  try {
    return savedData ? JSON.parse(savedData) : defaultValue
  } catch (e) {
    console.error('Error parsing storage data.', e)
    return defaultValue
  }
}

export function saveStorageTheme(theme: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_STORAGE, JSON.stringify(theme))
  }
}

export function getStorageTheme() {
  return getParsedTheme(THEME_STORAGE, 'DARK_THEME')
}
