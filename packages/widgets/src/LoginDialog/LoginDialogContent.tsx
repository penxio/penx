'use client'

import { useCallback } from 'react'
import {
  AuthKitProvider,
  SignInButton as FSignInButton,
  QRCode,
  StatusAPIResponse,
  useProfile,
  useSignIn,
} from '@farcaster/auth-kit'
import { Trans } from '@lingui/react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useSession } from '@penx/session'
import { api } from '@penx/trpc-client'
import { GoogleOauthButton } from '../GoogleOauthButton'
import { LoginForm } from './LoginForm'
import { useLoginDialog } from './useLoginDialog'

export function LoginDialogContent() {
  const { setIsOpen } = useLoginDialog()
  const { login, logout } = useSession()
  const searchParams = useSearchParams()

  return (
    <div className="flex flex-col gap-3 pb-5">
      <div className="space-y-1">
        {/* <div className="text-foreground/40">Web2 login</div> */}
        <GoogleOauthButton
          variant="outline"
          size="lg"
          className="border-foreground w-full"
        />
      </div>
      {/* <div className="text-foreground/40 text-center">or</div>
      <LoginForm /> */}
    </div>
  )
}
