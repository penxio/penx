'use client'

import React, { useMemo, useState } from 'react'
import { PageEmailLogin } from '@/pages/PageEmailLogin'
import { Capacitor } from '@capacitor/core'
import { SocialLogin } from '@capgo/capacitor-social-login'
import { IonButton, IonNavLink, useIonRouter } from '@ionic/react'
import { set } from 'idb-keyval'
import { MailIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { localDB } from '@penx/local-db'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'
import { MobileGoogleLoginInfo } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { IconGoogle } from '@penx/uikit/IconGoogle'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { LoginForm } from './LoginForm'

interface Props {}
export function EmailLoginButton({}: Props) {
  const { login } = useSession()
  const [json, setJson] = useState({})
  const [error, setError] = useState({})
  const [session, setSession] = useState({})
  const [loading, setLoading] = useState(false)
  const router = useIonRouter()

  return (
    <IonNavLink routerDirection="forward" component={() => <PageEmailLogin />}>
      <Button className="w-full gap-2">
        {loading && <LoadingDots className="bg-foreground" />}
        {!loading && (
          <>
            <MailIcon size={20} />
            <div className="">Email login</div>
          </>
        )}
      </Button>
    </IonNavLink>
  )
}
