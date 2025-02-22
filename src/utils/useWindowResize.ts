import { useState, useEffect } from 'react'

export function useWindowResize(breakpoint: number) {
  const [isSmallerThanBreakpoint, setIsSmallerThanBreakpoint] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false,
  )

  useEffect(() => {
    if (typeof window === 'undefined') return // Evita erro no SSR

    const handleResize = () => {
      setIsSmallerThanBreakpoint(window.innerWidth <= breakpoint)
    }

    handleResize() // Define o estado inicial corretamente no cliente

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isSmallerThanBreakpoint
}
