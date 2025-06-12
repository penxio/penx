import React from 'react'
import { LoginContent } from '@/components/Login/LoginContent'
import { RegisterForm } from '@/components/Login/RegisterForm'
import { isAndroid } from '@/lib/utils'
import { Capacitor } from '@capacitor/core'
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonNavLink,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { SyncContent } from './SyncContent'

export function PageSync() {
  return (
    <>
      <IonHeader
        className={isAndroid ? 'safe-area' : ''}
        style={{
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
        }}
      >
        <IonToolbar
          className="toolbar text-foreground"
          style={{
            '--border-width': 0,
            // borderBottom: scrolled ? '1px solid #eeee' : 'none',
            // borderBottom: 'none',
            // border: 'none',
          }}
        >
          <IonButtons slot="start">
            <IonBackButton className="" text=""></IonBackButton>
          </IonButtons>
          <IonTitle>
            <div className="text-foreground">
              <Trans>Sync</Trans>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen class="ion-padding content">
        <SyncContent />
      </IonContent>
    </>
  )
}
