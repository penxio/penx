'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

interface AnimateChangeInHeightProps {
  children: React.ReactNode
  className?: string
}

export const AnimateChangeInHeight: React.FC<AnimateChangeInHeightProps> = ({
  children,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const observedHeight = entries[0].contentRect.height
        setHeight(observedHeight)
      })

      resizeObserver.observe(containerRef.current)

      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [])

  return (
    <motion.div
      className={`${className || ''}`}
      style={{ height }}
      animate={{ height }}
      transition={{
        duration: 0.3,
        ease: [0.32, 0.72, 0, 1], // iOS-like easing curve
      }}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  )
}
