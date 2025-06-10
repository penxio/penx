import React from 'react'
import { EmailLoginForm } from '@/components/Login/EmailLoginForm'
import { LoginContent } from '@/components/Login/LoginContent'
import { RegisterForm } from '@/components/Login/RegisterForm'
import { Profile } from '@/components/Profile/Profile'
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
import { useAuthStatus } from '@penx/hooks/useAuthStatus'

const platform = Capacitor.getPlatform()

export function PageProfile() {
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
            // borderBottom: scrolled ? '1px solid #eeee' : 'none',
            // borderBottom: 'none',
            // border: 'none',
          }}
        >
          <IonButtons slot="start">
            <IonBackButton text=""></IonBackButton>
          </IonButtons>
          <IonTitle>
            <div className="text-foreground">
              <Trans>Settings</Trans>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen class="ion-padding content">
        <Profile></Profile>
      </IonContent>
    </>
  )
}
