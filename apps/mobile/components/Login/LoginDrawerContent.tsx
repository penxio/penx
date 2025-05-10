'use client'

import React, { useMemo, useState } from 'react'
import { SocialLogin } from '@capgo/capacitor-social-login'
import { useQuery } from '@tanstack/react-query'
import { set } from 'idb-keyval'
import { toast } from 'sonner'
import { ROOT_HOST } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useCreations } from '@penx/hooks/useCreations'
import { getGoogleUserInfo } from '@penx/libs/getGoogleUserInfo'
import { localDB } from '@penx/local-db'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'
import { MobileGoogleLoginInfo } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { IconGoogle } from '@penx/uikit/IconGoogle'
import { Input } from '@penx/uikit/input'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { LoginForm } from './LoginForm'

interface Props {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}
export function LoginDrawerContent({ setVisible }: Props) {
  const { login } = useSession()
  const [json, setJson] = useState({})
  const [error, setError] = useState({})
  const [session, setSession] = useState({})
  const [loading, setLoading] = useState(false)

  async function onLogin() {
    const todo = await fetch(
      'https://jsonplaceholder.typicode.com/todos/1',
    ).then((response) => response.json())
    console.log('todo.........>>>>:', todo)

    try {
      const res = (await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'openid', 'profile'],
        },
      })) as any as MobileGoogleLoginInfo
      // alert(JSON.stringify(res))
      // handle the response. popoutStore is specific to my app
      console.log('======res:', res)

      setJson(res.result)

      const sites = await localDB.site.toArray()
      const site = sites.find((s) => !s.isRemote)

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
      setVisible(false)
    } catch (error) {
      console.log('=========error:', error)

      setError(Object.values(error))
      //
    }
  }
  return (
    <div className="px-3">
      <div className="">
        <Button onClick={onLogin} className="w-full" variant="secondary">
          {loading && <LoadingDots className="bg-foreground" />}
          {!loading && (
            <>
              <IconGoogle className="h-4 w-4" />
              <div className="">Google login</div>
            </>
          )}
        </Button>
        <div className="text-foreground/40 my-2 text-center">or</div>
        <LoginForm setVisible={setVisible} />
        <div>
          <pre>{JSON.stringify(json, null, 2)}</pre>
          session:
          <pre>{JSON.stringify(session, null, 2)}</pre>
          error:
          <pre>{JSON.stringify(error, null, 2)}</pre>
          <div>{process.env.NEXT_PUBLIC_ROOT_HOST}</div>
        </div>
      </div>
    </div>
  )
}
