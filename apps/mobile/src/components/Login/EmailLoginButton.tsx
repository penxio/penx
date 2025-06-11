'use client'

import React from 'react'
import { PageEmailLogin } from '@/pages/PageEmailLogin'
import { IonNavLink } from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { MailIcon } from 'lucide-react'
import { Button } from '@penx/uikit/button'

interface Props {}
export function EmailLoginButton({}: Props) {
  return (
    <IonNavLink routerDirection="forward" component={() => <PageEmailLogin />}>
      <Button className="w-full" size="xl" variant="outline-solid">
        <MailIcon size={20} />
        <div className="flex-1">
          <Trans>Email login</Trans>
        </div>
      </Button>
    </IonNavLink>
  )
}
