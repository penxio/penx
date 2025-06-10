import React from 'react'
import { EmailLoginForm } from '@/components/Login/EmailLoginForm'
import { PinCodeForm } from '@/components/Login/PinCodeForm'
import { RegisterForm } from '@/components/Login/RegisterForm'
import { isAndroid } from '@/lib/utils'
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonNavLink,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { useAuthStatus } from '@penx/hooks/useAuthStatus'

export function PageEmailLogin() {
  const { authStatus } = useAuthStatus()
  return (
    <>
      <IonHeader
        className={isAndroid ? 'safe-area' : ''}
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
        <div className="mt-[20vh] flex h-full w-full flex-col">
          {authStatus.type === 'login' && <EmailLoginForm />}

          {authStatus.type === 'register' && <RegisterForm />}

          {authStatus.type === 'register-email-sent' && (
            <PinCodeForm></PinCodeForm>
          )}
        </div>
      </IonContent>
    </>
  )
}
