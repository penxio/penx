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
import { ChevronDown, ListFilterIcon } from 'lucide-react'
import { GoToDay } from '@penx/components/GoToDay'
import { useArea } from '@penx/hooks/useArea'
import { usePanels } from '@penx/hooks/usePanels'
import { PanelType } from '@penx/types'
import { cn } from '@penx/utils'

const platform = Capacitor.getPlatform()

export const HomeHeader: React.FC = () => {
  const { area } = useArea()
  const { panels } = usePanels()
  const [panel] = panels
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
        className="toolbar flex items-center pl-3"
        style={{
          // '--background': 'white',
          '--border-width': 0,
          // borderBottom: scrolled ? '1px solid #eeee' : 'none',
          // borderBottom: 'none',
          // border: 'none',
        }}
      >
        <IonButtons slot="start">
          <IonMenuToggle className="flex items-center">
            <span className="icon-[heroicons-outline--menu-alt-2] size-6"></span>
          </IonMenuToggle>
        </IonButtons>

        <div className="text-foreground/50 text-md flex items-center gap-1 px-2">
          <div className="text-foreground text-xl font-bold">Journal</div>
        </div>
        {/* <IonTitle slot="start" className="mx-1">
          {title}
        </IonTitle> */}

        <IonButtons slot="end" className="">
          {panel.date && <GoToDay initialDate={new Date(panel.date!)} />}
          <SearchButton />
          {/* <EditWidgetButton /> */}
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  )
}
