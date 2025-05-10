'use client'

import React, { useMemo, useState } from 'react'
import {
  GoogleLoginResponseOnline,
  SocialLogin,
} from '@capgo/capacitor-social-login'
import { set } from 'idb-keyval'
import { toast } from 'sonner'
import { appEmitter } from '@penx/emitter'
import { useCreations } from '@penx/hooks/useCreations'
import { getGoogleUserInfo } from '@penx/libs/getGoogleUserInfo'
import { localDB } from '@penx/local-db'
import { queryClient } from '@penx/query-client'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'
import { MobileGoogleLoginInfo } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Input } from '@penx/uikit/input'

interface Props {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}
export function LoginDrawerContent({ setVisible }: Props) {
  const [json, setJson] = useState({})
  async function login() {
    const res = (await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['email', 'openid', 'profile'],
      },
    })) as any as MobileGoogleLoginInfo
    // alert(JSON.stringify(res))
    // handle the response. popoutStore is specific to my app

    setJson(res.result)

    const sites = await localDB.site.toArray()
    const site = sites.find((s) => !s.isRemote)

    const session = await api.auth.loginWithGoogleToken.mutate({
      openid: res.result.accessToken.userId,
      token: res.result.accessToken.token as string,
      userId: site?.userId,
    })

    await set('SESSION', session)
    queryClient.setQueryData(['SESSION'], session)
    location.reload()
  }
  return (
    <div>
      <div className="">
        <Button onClick={login}>Login</Button>
        <pre>{JSON.stringify(json, null, 2)}</pre>
      </div>
    </div>
  )
}
