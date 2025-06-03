import React from 'react'
import { useTheme } from '@/components/theme-provider'
import { Capacitor } from '@capacitor/core'
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonNavLink,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { FullPageDatabase } from '@penx/components/database-ui'
import { Struct } from '@penx/domain'
import { useStructs } from '@penx/hooks/useStructs'

const platform = Capacitor.getPlatform()

export function PageStructInfo({ struct }: { struct: Struct }) {
  return (
    <>
      <IonHeader
        className={platform === 'android' ? 'safe-area' : ''}
        style={{
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
        }}
      >
        <IonToolbar
          className="toolbar text-foreground"
          style={{
            '--border-width': 0,
          }}
        >
          <IonButtons slot="start">
            <IonBackButton text=""></IonBackButton>
          </IonButtons>
          <IonTitle>
            <div className="text-foreground">{struct.name}</div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen class="content text-foreground">
        <div id="portal" className="fixed left-0 top-0 z-[1000]" />
        <Content structId={struct.id} />
      </IonContent>
    </>
  )
}

function Content({ structId }: { structId: string }) {
  const { theme, isDark } = useTheme()
  const { structs } = useStructs()
  const struct = structs.find((s) => s.id === structId)!

  return <FullPageDatabase struct={struct} theme={isDark ? 'dark' : 'light'} />
}
