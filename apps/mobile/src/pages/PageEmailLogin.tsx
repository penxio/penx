import React from 'react'
import { LoginForm } from '@/components/Login/LoginForm'
import { PinCodeForm } from '@/components/Login/PinCodeForm'
import { RegisterForm } from '@/components/Login/RegisterForm'
import { Capacitor } from '@capacitor/core'
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonNavLink,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { useAuthStatus } from '@penx/hooks/useAuthStatus'

const platform = Capacitor.getPlatform()

export function PageEmailLogin() {
  const { authStatus } = useAuthStatus()
  return (
    <>
      <IonHeader
        className={platform === 'android' ? 'safe-area' : ''}
        style={{
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
        }}
      >
        <IonToolbar
          className="toolbar"
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
            <Trans>Email login</Trans>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen class="ion-padding content">
        <div className="flex h-full w-full flex-col justify-center">
          {authStatus.type === 'login' && <LoginForm></LoginForm>}

          {authStatus.type === 'register' && <RegisterForm />}

          {authStatus.type === 'register-email-sent' && (
            <PinCodeForm></PinCodeForm>
          )}
        </div>
      </IonContent>
    </>
  )
}
