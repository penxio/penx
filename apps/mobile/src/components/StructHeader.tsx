import React, { useMemo } from 'react'
import { SearchButton } from '@/components/MobileSearch/SearchButton'
import { isAndroid } from '@/lib/utils'
import { PageStructInfo } from '@/pages/PageStructInfo/PageStructInfo'
import { Capacitor } from '@capacitor/core'
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonMenuToggle,
  IonNavLink,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { GoToDay } from '@penx/components/GoToDay'
import { useArea } from '@penx/hooks/useArea'
import { usePanels } from '@penx/hooks/usePanels'
import { useStructs } from '@penx/hooks/useStructs'
import { PanelType } from '@penx/types'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'

export const StructHeader: React.FC = () => {
  const { area } = useArea()
  return (
    <IonHeader
      className={cn(isAndroid ? 'safe-area' : '')}
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

        <IonTitle slot="start" className="text-foreground mx-1"></IonTitle>

        <IonButtons slot="end"></IonButtons>
      </IonToolbar>
    </IonHeader>
  )
}
