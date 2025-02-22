import { useState } from 'react'

export function useDragScroll(
  columnsContainerRef: React.RefObject<HTMLDivElement>,
) {
  const enableScrollFeature = true

  const [isDragging, setIsDragging] = useState(false)

  const [startX, setStartX] = useState<number | null>(null)

  const [scrollLeft, setScrollLeft] = useState<number | null>(null)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    const container = columnsContainerRef.current

    if (container) {
      container.classList.add('hand-cursor')
      setStartX(e.pageX - container.offsetLeft)
      setScrollLeft(container.scrollLeft)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableScrollFeature) {
      return
    }

    if (!isDragging || startX === null || scrollLeft === null) return

    const container = columnsContainerRef.current
    if (container) {
      const x = e.pageX - container.offsetLeft
      const walk = (x - startX) * 1
      container.scrollLeft = scrollLeft - walk
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    const container = columnsContainerRef.current
    if (container) {
      container.classList.remove('hand-cursor')
    }
  }

  return {
    isDragging,
    startX,
    scrollLeft,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}
