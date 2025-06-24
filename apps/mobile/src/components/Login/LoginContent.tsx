'use client'

import React, { useMemo, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { SocialLogin } from '@capgo/capacitor-social-login'
import { Trans, useLingui } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { set } from 'idb-keyval'
import { api } from '@penx/api'
import { appEmitter } from '@penx/emitter'
import { localDB } from '@penx/local-db'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'
import { MobileGoogleLoginInfo } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { IconGoogle } from '@penx/uikit/IconGoogle'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { AppleLoginButton } from './AppleLoginButton'
import { EmailLoginButton } from './EmailLoginButton'
import { EmailLoginForm } from './EmailLoginForm'
import { GoogleLoginButton } from './GoogleLoginButton'
import { PhoneLoginButton } from './PhoneLoginButton'

interface Props {}

const platform = Capacitor.getPlatform()

export function LoginContent({}: Props) {
  const { i18n } = useLingui()

  return (
    <div className="text-foreground flex h-full flex-1 flex-col justify-center gap-3">
      <div className="-mt-40 flex flex-col gap-2">
        <div className="mb-10 text-center text-2xl font-bold">
          <Trans>Welcome to PenX</Trans>
        </div>

        {platform === 'ios' && <AppleLoginButton />}

        <GoogleLoginButton />

        <EmailLoginButton />
        {i18n.locale === 'zh-CN' && <PhoneLoginButton />}
        {/* <div className="text-foreground/40 my-4 text-center">or</div>
        <LoginForm setVisible={setVisible} /> */}
      </div>
    </div>
  )
}
