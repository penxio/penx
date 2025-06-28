import React, { PropsWithChildren, ReactNode } from 'react'
import { useTheme } from '@/components/theme-provider'

interface Props {
  title?: ReactNode
  rightSlot?: ReactNode
  children: (props: { containerWidth: number }) => ReactNode
}

export const ImageListContainer = ({ title, rightSlot, children }: Props) => {
  const { isDark } = useTheme()
  const ref = React.useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = React.useState(0)

  React.useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setContainerWidth(ref.current.offsetWidth)
      }
    }
    handleResize()

    window.addEventListener('resize', handleResize)
    const resizeObserver = new window.ResizeObserver(handleResize)
    if (ref.current) {
      resizeObserver.observe(ref.current)
    }
    return () => {
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div ref={ref} className="flex flex-col bg-red-300">
      {containerWidth > 0 && children({ containerWidth })}
    </div>
  )
}
