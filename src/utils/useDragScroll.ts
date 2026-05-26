import { useRef } from 'react'

export function useDragScroll(
  columnsContainerRef: React.RefObject<HTMLDivElement>,
) {
  const enableScrollFeature = true

  const isDraggingRef = useRef(false)
  const startXRef = useRef<number | null>(null)
  const scrollLeftRef = useRef<number | null>(null)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true
    const container = columnsContainerRef.current

    if (container) {
      container.classList.add('hand-cursor')
      startXRef.current = e.pageX - container.offsetLeft
      scrollLeftRef.current = container.scrollLeft
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableScrollFeature) return

    if (
      !isDraggingRef.current ||
      startXRef.current === null ||
      scrollLeftRef.current === null
    )
      return

    const container = columnsContainerRef.current
    if (container) {
      const x = e.pageX - container.offsetLeft
      const walk = (x - startXRef.current) * 1
      container.scrollLeft = scrollLeftRef.current - walk
    }
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
    const container = columnsContainerRef.current
    if (container) {
      container.classList.remove('hand-cursor')
    }
  }

  const handleContainerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement

    if (target.closest('.task-card') || target.closest('.modal')) {
      return
    }

    handleMouseDown(e)
  }

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleContainerMouseDown,
  }
}
