import React from 'react'
import { isAndroid } from '@/lib/utils'
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
import { Trans } from '@lingui/react/macro'
import { cn } from '@penx/utils'

export const AllStructsHeader: React.FC = () => {
  return (
    <IonHeader
      className={cn(isAndroid ? 'safe-area' : '')}
      style={{
        boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)',
      }}
    >
      <IonToolbar
        className="toolbar flex items-center"
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

        <IonTitle slot="start" className="text-foreground mx-1">
          <Trans>Structs</Trans>
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  )
}
