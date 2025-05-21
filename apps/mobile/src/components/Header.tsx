import React, { useMemo } from 'react'
import { SearchButton } from '@/components/MobileSearch/SearchButton'
import { Capacitor } from '@capacitor/core'
import {
  IonButtons,
  IonHeader,
  IonIcon,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useMotionValue } from 'motion/react'
import { useArea } from '@penx/hooks/useArea'
import { usePanels } from '@penx/hooks/usePanels'
import { PanelType } from '@penx/types'
import { cn } from '@penx/utils'

const platform = Capacitor.getPlatform()

export const Header: React.FC = () => {
  const { area } = useArea()
  const { panels } = usePanels()
  const [panel] = panels
  console.log('=====panel:', panel)
  const title = useMemo(() => {
    if (panel) {
      if (panel.type === PanelType.JOURNAL) return 'Journal'
    }
    return ''
  }, [panel])

  return (
    <IonHeader
      className={cn(platform === 'android' ? 'safe-area' : '')}
      style={{
        boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)',
      }}
    >
      <IonToolbar
        className="toolbar px-3 "
        style={{
          // '--background': 'white',
          '--border-width': 0,
          // borderBottom: scrolled ? '1px solid #eeee' : 'none',
          // borderBottom: 'none',
          // border: 'none',
        }}
      >
        <IonButtons slot="start">
          <IonMenuToggle>
            <span className="icon-[heroicons-outline--menu-alt-2] size-6"></span>
          </IonMenuToggle>
        </IonButtons>

        <IonTitle slot="start" className="mx-1">
          {title}
        </IonTitle>

        <IonButtons slot="end" className="">
          <SearchButton />
          {/* <EditWidgetButton /> */}
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  )
}
