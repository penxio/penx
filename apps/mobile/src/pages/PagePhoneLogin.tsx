import React from 'react'
import { PhoneLoginForm } from '@/components/Login/PhoneLoginForm'
import { PhonePinCodeForm } from '@/components/Login/PhonePinCodeForm'
import { isAndroid } from '@/lib/utils'
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

export function PagePhoneLogin() {
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
            <Trans>Phone login</Trans>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen class="ion-padding content">
        <div className="mt-[20vh] flex h-full w-full flex-col">
          {authStatus.type === 'login' && <PhoneLoginForm />}
          {authStatus.type === 'sms-code-sent' && (
            <PhonePinCodeForm></PhonePinCodeForm>
          )}
        </div>
      </IonContent>
    </>
  )
}
