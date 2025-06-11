'use client'

import React from 'react'
import { PageEmailLogin } from '@/pages/PageEmailLogin'
import { PagePhoneLogin } from '@/pages/PagePhoneLogin'
import { IonNavLink } from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { MailIcon, PhoneIcon } from 'lucide-react'
import { useAuthStatus } from '@penx/hooks/useAuthStatus'
import { Button } from '@penx/uikit/button'

interface Props {}
export function PhoneLoginButton({}: Props) {
  const { setAuthStatus } = useAuthStatus()
  return (
    <IonNavLink routerDirection="forward" component={() => <PagePhoneLogin />}>
      <Button
        className="w-full"
        size="xl"
        variant="outline-solid"
        onClick={() => {
          setAuthStatus({ type: 'login' })
        }}
      >
        <PhoneIcon size={20} />
        <div className="flex-1">
          <Trans>Phone login</Trans>
        </div>
      </Button>
    </IonNavLink>
  )
}
