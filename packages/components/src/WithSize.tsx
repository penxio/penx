import { useEffect, useRef, useState } from 'react'
import { DATABASE_TOOLBAR_HEIGHT, WORKBENCH_NAV_HEIGHT } from '@penx/constants'
import { cn } from '@penx/utils'

type Size = {
  height: number | string
  width: number | string
}

interface WithWidthProps {
  children: (size: Size) => React.ReactNode
  className?: string
}

export const WithSize: React.FC<WithWidthProps> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [width, setWith] = useState<number | 'auto'>('auto')
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const observedWidth = entries[0].contentRect.width
        const observedHeight = entries[0].contentRect.height
        setWith(observedWidth)
        setHeight(observedHeight)
      })

      resizeObserver.observe(containerRef.current)
      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [])

  return (
    <div className={cn(className)} ref={containerRef}>
      {children({ width, height })}
    </div>
  )
}
