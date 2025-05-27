'use client'

import { Trans } from '@lingui/react/macro'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useSession } from '@penx/session'
import { AppleOauthButton } from '../AppleOauthButton'
import { GoogleOauthButton } from '../GoogleOauthButton'
import { LoginForm } from './LoginForm'
import { useLoginDialog } from './useLoginDialog'

export function LoginDialogContent() {
  return (
    <div className="flex flex-col gap-3 pb-5">
      <div className="space-y-2">
        <GoogleOauthButton
          variant="outline"
          size="lg"
          className="border-foreground w-full"
        />

        <AppleOauthButton
          variant="outline"
          size="lg"
          className="border-foreground w-full"
        />
      </div>
      <div className="text-foreground/40 text-center">or</div>
      <LoginForm />
    </div>
  )
}
