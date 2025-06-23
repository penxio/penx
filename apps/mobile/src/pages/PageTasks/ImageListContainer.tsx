import React, { PropsWithChildren, ReactNode } from 'react'
import { MobileHeaderWrapper } from '@/components/MobileHeaderWrapper'
import { useTheme } from '@/components/theme-provider'
import { IonContent } from '@ionic/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Creation } from '@penx/domain'

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
    <IonContent
      fullscreen
      className="relative flex h-screen flex-col"
      style={{
        '--background': isDark ? '#222' : '#fff',
        boxShadow: '-10px 0 10px -5px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div ref={ref} className="flex h-screen flex-col overflow-hidden">
        <MobileHeaderWrapper
          title={title}
          rightSlot={rightSlot}
        ></MobileHeaderWrapper>

        {containerWidth > 0 && children({ containerWidth })}
      </div>
    </IonContent>
  )
}
