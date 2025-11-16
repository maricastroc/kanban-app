import { useState, useEffect } from 'react'

export function useWindowResize(breakpoint: number) {
  const [isSmallerThanBreakpoint, setIsSmallerThanBreakpoint] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false,
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setIsSmallerThanBreakpoint(window.innerWidth <= breakpoint)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isSmallerThanBreakpoint
}
