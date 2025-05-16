'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  GOOGLE_CLIENT_ID,
  LINK_GOOGLE_ACCOUNT_REDIRECT_URI,
} from '@penx/constants'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { IconGoogle } from '@penx/uikit/IconGoogle'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { cn } from '@penx/utils'

export function LinkGoogleButton() {
  const [loading, setLoading] = useState(false)
  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')
  const { data } = useSession()

  useEffect(() => {
    if (error === 'account-linked') {
      toast.error(
        'Link failed! This is google account is already linked to another account.',
      )
    } else if (error === 'link-fail') {
      toast.error('Link failed! Fail to fetch google user info.')
    } else {
      const errorMessage = Array.isArray(error) ? error.pop() : error
      errorMessage && toast.error(errorMessage)
    }
  }, [error])
  return (
    <div>
      <Button
        size="lg"
        className={cn('w-full gap-2 rounded-lg')}
        disabled={loading}
        onClick={() => {
          setLoading(true)
          const redirectUri = LINK_GOOGLE_ACCOUNT_REDIRECT_URI
          const state = `${location.protocol}//${location.host}____${data?.userId}`
          const scope = 'openid email profile'
          const googleAuthUrl =
            `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${redirectUri}` +
            `&scope=${scope}&client_id=${GOOGLE_CLIENT_ID}&state=${state}&access_type=offline`
          // &prompt=consent
          location.href = googleAuthUrl
        }}
      >
        {loading && <LoadingDots className="bg-background" />}
        {!loading && (
          <>
            <IconGoogle className="h-4 w-4" />
            <div className="">Link Google</div>
          </>
        )}
      </Button>
    </div>
  )
}
