'use client'

import React, { useMemo, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { SocialLogin } from '@capgo/capacitor-social-login'
import { set } from 'idb-keyval'
import { appEmitter } from '@penx/emitter'
import { useCopyToClipboard } from '@penx/hooks/useCopyToClipboard'
import { localDB } from '@penx/local-db'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'
import { MobileAppleLoginInfo, MobileGoogleLoginInfo } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { IconGoogle } from '@penx/uikit/IconGoogle'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { EmailLoginForm } from './EmailLoginForm'

interface Props {}
export function AppleLoginButton({}: Props) {
  const { login } = useSession()
  const [error, setError] = useState({})
  const [session, setSession] = useState({})
  const [loading, setLoading] = useState(false)
  const { copy } = useCopyToClipboard()

  async function onLogin() {
    setLoading(true)
    try {
      const res = (await SocialLogin.login({
        provider: 'apple',
        options: {
          scopes: ['email', 'name'],
        },
      })) as any as MobileAppleLoginInfo
      // alert(JSON.stringify(res))
      // handle the response. popoutStore is specific to my app
      console.log('======res:', res)

      const sites = await localDB.listAllSpaces()
      const site = sites.find((s) => !s.props.isRemote)

      const session = await login({
        type: 'penx-apple',
        accessToken: res.result.accessToken.token as string,
        username: res.result.profile?.givenName || '',
        userId: site?.userId!,
        ref: '',
      })

      setSession(session)
      await set('SESSION', session)
      queryClient.setQueryData(['SESSION'], session)
      appEmitter.emit('APP_LOGIN_SUCCESS', session)
    } catch (error) {
      console.log('=========error:', error)

      setError(Object.values(error))
    }

    setLoading(false)
  }
  return (
    <>
      <Button onClick={onLogin} className="w-full" variant="default" size="xl">
        {loading && <LoadingDots className="bg-background" />}
        {!loading && (
          <>
            <span className="icon-[ic--baseline-apple] size-6"></span>
            <div className="flex-1">Apple login</div>
          </>
        )}
      </Button>
    </>
  )
}
