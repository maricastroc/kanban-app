/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'

export function useEscapeKeyHandler(onClose: () => void) {
  useEffect(() => {
    const handleEscapeKeyPress = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscapeKeyPress as any)

    return () => {
      document.removeEventListener('keydown', handleEscapeKeyPress as any)
    }
  }, [onClose])
}
