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
import { AppleLoginButton } from './AppleLoginButton'
import { GoogleLoginButton } from './GoogleLoginButton'
import { LoginForm } from './LoginForm'

interface Props {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const platform = Capacitor.getPlatform()

export function LoginContent({ setVisible }: Props) {
  return (
    <div className="-mt-10 flex h-full flex-1 flex-col justify-center px-6">
      <div className="space-y-2">
        <GoogleLoginButton setVisible={setVisible} />
        {platform === 'ios' && <AppleLoginButton setVisible={setVisible} />}

        <div className="text-foreground/40 my-4 text-center">or</div>
        <LoginForm setVisible={setVisible} />
      </div>
    </div>
  )
}
