import React, { PropsWithChildren, ReactNode } from 'react'
import { IonContent } from '@ionic/react'
import { cn } from '@penx/utils'
import { MobileHeaderWrapper } from './MobileHeaderWrapper'
import { useTheme } from './theme-provider'

interface Props {
  title?: ReactNode
  rightSlot?: ReactNode
  style?: React.CSSProperties
  backgroundColor?: string
  className?: string
  bordered?: boolean
}

export const MobileContent = ({
  title,
  rightSlot,
  backgroundColor,
  children,
  className,
  bordered = true,
}: PropsWithChildren<Props>) => {
  const { isDark } = useTheme()
  return (
    <IonContent
      fullscreen
      className="relative flex h-screen flex-col"
      style={{
        '--background': isDark ? '#222' : backgroundColor || '#fff',
        boxShadow: '-10px 0 10px -5px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className="flex h-screen flex-col overflow-hidden">
        <MobileHeaderWrapper
          title={title}
          rightSlot={rightSlot}
        ></MobileHeaderWrapper>
        <div
          className={cn('flex-1 overflow-auto px-3 pb-3', className)}
          style={{
            paddingTop: 'calc(var(--safe-area-inset-top) + 60px)',
          }}
        >
          {children}
        </div>
      </div>
    </IonContent>
  )
}
