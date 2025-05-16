'use client'

import React from 'react'
import { PageEmailLogin } from '@/pages/PageEmailLogin'
import { IonNavLink } from '@ionic/react'
import { MailIcon } from 'lucide-react'
import { Button } from '@penx/uikit/button'

interface Props {}
export function EmailLoginButton({}: Props) {
  return (
    <IonNavLink routerDirection="forward" component={() => <PageEmailLogin />}>
      <Button className="w-full gap-2">
        <MailIcon size={20} />
        <div className="">Email login</div>
      </Button>
    </IonNavLink>
  )
}
