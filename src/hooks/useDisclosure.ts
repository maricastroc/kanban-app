import { useCallback, useState } from 'react'

/**
 * Manages a boolean open/close state for modals, dropdowns and popovers.
 * `setIsOpen` is exposed for controlled components (e.g. Radix `onOpenChange`).
 */
export function useDisclosure(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, open, close, toggle, setIsOpen }
}
