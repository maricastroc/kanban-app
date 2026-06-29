import { useEffect, RefObject } from 'react'

/**
 * Calls `handler` on a pointer event (mouse/touch) outside the referenced
 * element. Used to dismiss popovers, dropdowns and context menus.
 *
 * Escape-to-close is a separate concern — see `useEscapeKey`.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const el = ref.current
      if (!el || el.contains(event.target as Node)) return
      handler()
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [ref, handler, enabled])
}
