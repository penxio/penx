import React from 'react'
import { EmailLoginForm } from '@/components/Login/EmailLoginForm'
import { PinCodeForm } from '@/components/Login/PinCodeForm'
import { RegisterForm } from '@/components/Login/RegisterForm'
import { MobileContent } from '@/components/MobileContent'
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
    <MobileContent title={<Trans>Email login</Trans>}>
      <div className="mt-[20vh] flex h-full w-full flex-col">
        {authStatus.type === 'login' && <EmailLoginForm />}

        {authStatus.type === 'register' && <RegisterForm />}

        {authStatus.type === 'register-email-sent' && (
          <PinCodeForm></PinCodeForm>
        )}
      </div>
    </MobileContent>
  )
}
