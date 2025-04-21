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
  const showWalletLogin = searchParams?.get('wallet') === 'true'

  const handleSuccess = useCallback(
    async (res: StatusAPIResponse) => {
      // alert('Signed in successfully')
      await login({
        type: 'penx-farcaster',
        message: res.message!,
        signature: res.signature!,
        name: res.username!,
        pfp: res.pfpUrl!,
      })

      toast.success('Signed in successfully')
      setIsOpen(false)
    },
    [setIsOpen, login],
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-1">
        {/* <div className="text-foreground/40">Web2 login</div> */}
        <GoogleOauthButton
          variant="outline"
          size="lg"
          className="border-foreground w-full"
        />
      </div>
      {/* <Separator /> */}

      {/* <SignInButton
        // onStatusResponse={(res) => {
        //   alert(JSON.stringify(res))
        // }}
        nonce={api.user.getNonce.query}
        onSuccess={handleSuccess}
        onError={(error) => {
          // alert('Failed to sign in' + JSON.stringify(error))
          toast.error('Failed to sign in')
        }}
        onSignOut={() => logout()}
      /> */}
      <div className="text-foreground/40 text-center">or</div>
      <LoginForm />
    </div>
  )
}
