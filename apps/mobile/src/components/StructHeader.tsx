import React, { useMemo } from 'react'
import { SearchButton } from '@/components/MobileSearch/SearchButton'
import { Capacitor } from '@capacitor/core'
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { GoToDay } from '@penx/components/GoToDay'
import { useArea } from '@penx/hooks/useArea'
import { usePanels } from '@penx/hooks/usePanels'
import { useStructs } from '@penx/hooks/useStructs'
import { PanelType } from '@penx/types'
import { cn } from '@penx/utils'

const platform = Capacitor.getPlatform()

export const StructHeader: React.FC = () => {
  const { area } = useArea()
  const { panels } = usePanels()
  const { structs } = useStructs()
  const title = useMemo(() => {
    const structPanels = panels.find((p) => p.type === PanelType.STRUCT)
    const struct = structs.find((s) => s.id === structPanels?.structId)
    return struct?.name || ''
  }, [panels, structs])

  return (
    <IonHeader
      className={cn(platform === 'android' ? 'safe-area' : '')}
      style={{
        boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)',
      }}
    >
      <IonToolbar
        className="toolbar text-foreground flex items-center"
        style={{
          // '--background': 'white',
          '--border-width': 0,
          // borderBottom: scrolled ? '1px solid #eeee' : 'none',
          // borderBottom: 'none',
          // border: 'none',
        }}
      >
        <IonButtons slot="start">
          <IonBackButton text=""></IonBackButton>
        </IonButtons>

        <IonTitle slot="start" className="mx-1">
          {title}
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  )
}
