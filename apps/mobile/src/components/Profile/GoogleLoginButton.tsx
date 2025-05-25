'use client'

import React, { useMemo, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { SocialLogin } from '@capgo/capacitor-social-login'
import { set } from 'idb-keyval'
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
export function GoogleLoginButton({}: Props) {
  const { login } = useSession()
  const [json, setJson] = useState({})
  const [error, setError] = useState({})
  const [session, setSession] = useState({})
  const [loading, setLoading] = useState(false)

  async function onLogin() {
    setLoading(true)
    try {
      const res = (await SocialLogin.login({
        provider: 'google',
        options: {
          // scopes: ['email', 'openid', 'profile'],
        },
      })) as any as MobileGoogleLoginInfo
      // handle the response. popoutStore is specific to my app
      console.log('======res:', res)

      setJson(res)

      const sites = await localDB.listAllSites()
      const site = sites.find((s) => !s.props.isRemote)

      const session = await login({
        type: 'penx-google',
        accessToken: res.result.accessToken.token as string,
        userId: site?.userId!,
        ref: '',
      })

      setSession(session)
      await set('SESSION', session)
      queryClient.setQueryData(['SESSION'], session)
      appEmitter.emit('APP_LOGIN_SUCCESS', session)
    } catch (error) {
      console.log('=========error:', error)

      setError(Object.keys(error))
    }

    setLoading(false)
  }
  return (
    <Button onClick={onLogin} className="w-full gap-2">
      {loading && <LoadingDots className="bg-background" />}
      {!loading && (
        <>
          <IconGoogle className="h-4 w-4" />
          <div className="">Google login</div>
        </>
      )}
    </Button>
  )
}
