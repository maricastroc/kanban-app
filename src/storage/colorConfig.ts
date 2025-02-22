const COLORS_STORAGE = '@kanban:colors'

export function getParsedColors(storageKey: string) {
  if (typeof window === 'undefined') return {} // Evita erro no servidor

  const savedData = localStorage.getItem(storageKey)
  try {
    return savedData ? JSON.parse(savedData) : {}
  } catch (e) {
    console.error('Error parsing storage data.', e)
    return {}
  }
}

export function saveColumnColor(index: number, color: string) {
  if (typeof window !== 'undefined') {
    const colors = getParsedColors(COLORS_STORAGE)
    colors[index] = color
    localStorage.setItem(COLORS_STORAGE, JSON.stringify(colors))
  }
}

export function getColumnColor(index: number) {
  if (typeof window === 'undefined') return null

  const colors = getParsedColors(COLORS_STORAGE)
  return colors[index] || null
}

export function getStorageColors() {
  return getParsedColors(COLORS_STORAGE)
}
