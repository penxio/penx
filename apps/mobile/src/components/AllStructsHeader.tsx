import React from 'react'
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
import { cn } from '@penx/utils'

const platform = Capacitor.getPlatform()

export const AllStructsHeader: React.FC = () => {
  return (
    <IonHeader
      className={cn(platform === 'android' ? 'safe-area' : '')}
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
          <IonBackButton color="dark" text=""></IonBackButton>
        </IonButtons>

        <IonTitle slot="start" className="mx-1">
          Structs
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  )
}
