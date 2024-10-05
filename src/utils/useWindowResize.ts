import { useState, useEffect } from 'react'

export function useWindowResize(breakpoint: number) {
  const [isSmallerThanBreakpoint, setIsSmallerThanBreakpoint] = useState(
    window.innerWidth <= breakpoint,
  )

  useEffect(() => {
    const handleResize = () => {
      setIsSmallerThanBreakpoint(window.innerWidth <= breakpoint)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isSmallerThanBreakpoint
}
