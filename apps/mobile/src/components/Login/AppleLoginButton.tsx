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
import { MobileGoogleLoginInfo } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { IconGoogle } from '@penx/uikit/IconGoogle'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { LoginForm } from './LoginForm'

interface Props {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}
export function AppleLoginButton({ setVisible }: Props) {
  const { login } = useSession()
  const [json, setJson] = useState({})
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
      })) as any as MobileGoogleLoginInfo
      // alert(JSON.stringify(res))
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

      console.log('======session:', session)

      setSession(session)
      await set('SESSION', session)
      queryClient.setQueryData(['SESSION'], session)
      appEmitter.emit('APP_LOGIN_SUCCESS', session)
      setVisible(false)
    } catch (error) {
      console.log('=========error:', error)

      setError(Object.values(error))
      //
    }

    setLoading(false)
  }
  return (
    <>
      <Button onClick={onLogin} className="w-full gap-2" variant="default">
        {loading && <LoadingDots className="bg-background" />}
        {!loading && (
          <>
            <span className="icon-[ic--baseline-apple] size-6"></span>
            <div className="">Apple login</div>
          </>
        )}
      </Button>

      <div>
        <pre
          onClick={() => {
            copy(JSON.stringify(json, null, 2))
          }}
        >
          {JSON.stringify(json, null, 2)}
        </pre>
        session:
        <pre>{JSON.stringify(session, null, 2)}</pre>
        error:
        <pre>{JSON.stringify(error, null, 2)}</pre>
        <div>{process.env.NEXT_PUBLIC_ROOT_HOST}</div>
      </div>
    </>
  )
}
