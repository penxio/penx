'use client'

import React, { ReactNode, useMemo } from 'react'
import { isAndroid, isIOS } from '@/lib/utils'
import { IonBackButton, IonButtons, IonToolbar } from '@ionic/react'
import { ArrowLeftIcon, ChevronLeftIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'

interface Props {
  className?: string
  title?: ReactNode
  rightSlot?: ReactNode
}

export function MobileHeaderWrapper({ className, title, rightSlot }: Props) {
  const h = useMemo(() => {
    if (isAndroid) return 'calc(var(--safe-area-inset-top) + 50px)'
    return 'calc(var(--safe-area-inset-top) + 40px)'
  }, [isIOS, isAndroid])
  return (
    <div
      className={cn(
        'border-foreground/10 bg-background fixed left-0 right-0 top-0 z-[10000] flex items-center justify-between gap-2 border-b-[0.5px] pb-2 pl-3',
      )}
      style={{
        paddingTop: 'var(--safe-area-inset-top)',
        height: h,
      }}
    >
      <div className="w-32">
        <ChevronLeftIcon
          size={28}
          onClick={() => {
            appEmitter.emit('ROUTE_TO_BACK')
          }}
        />
      </div>
      <div>{title}</div>
      <div className="flex w-32 justify-end">{rightSlot}</div>
    </div>
  )
}
