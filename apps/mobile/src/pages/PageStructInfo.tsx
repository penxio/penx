import React from 'react'
import { LoginContent } from '@/components/Login/LoginContent'
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

const platform = Capacitor.getPlatform()

export function PageStructInfo() {
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
            <div className="text-foreground">
              <Trans>Create struct</Trans>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen class="ion-padding content">
        <LoginContent />
      </IonContent>
    </>
  )
}
