import * as React from 'react'
import {
  useContainerPosition,
  useMasonry,
  UseMasonryOptions,
  usePositioner,
  useResizeObserver,
} from 'masonic'
import { cn } from '@penx/utils'

interface CustomProps {
  className?: string
  height: number
  width: number
}

export const CustomMasonry = ({
  items,
  render,
  width: propWidth,
  height: propHeight,
  className,
  ...props
}: Omit<UseMasonryOptions<any>, 'positioner' | 'scrollTop'> & CustomProps) => {
  const containerRef = React.useRef(null)

  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const { offset, width } = useContainerPosition(containerRef, [
    propWidth,
    propHeight,
  ])

  const positioner = usePositioner(
    {
      width,
      columnWidth: 240,
      columnGutter: 16,
    },
    [width, items.length],
  )

  const resizeObserver = useResizeObserver(positioner)

  const [scrollTop, setScrollTop] = React.useState(0)
  const [isScrolling, setIsScrolling] = React.useState(false)
  const [containerHeight, setContainerHeight] = React.useState(600)

  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    let scrollTimer: NodeJS.Timeout

    const handleScroll = () => {
      setScrollTop(scrollContainer.scrollTop)
      setIsScrolling(true)

      if (scrollTimer) clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    const handleResize = () => {
      setContainerHeight(scrollContainer.offsetHeight)
    }

    scrollContainer.addEventListener('scroll', handleScroll)

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(scrollContainer)

    setContainerHeight(scrollContainer.offsetHeight)

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
      resizeObserver.disconnect()
      clearTimeout(scrollTimer)
    }
  }, [])

  return (
    <div
      ref={scrollContainerRef}
      className={cn('overflow-auto', className)}
      style={{
        width: propWidth,
        height: propHeight,
      }}
    >
      {useMasonry({
        items,
        render: render,
        // scrollTop,
        isScrolling,
        height: containerHeight,
        containerRef,
        resizeObserver,
        ...props,
        scrollTop: scrollTop,
        positioner,
      })}
    </div>
  )
}
