'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { IconGoogle } from '@/components/icons/IconGoogle'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useSession } from '@penx/session'
import { Button, ButtonProps } from '@penx/uikit/ui/button'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_DRIVE_OAUTH_REDIRECT_URI,
  GOOGLE_OAUTH_REDIRECT_URI,
} from '@penx/constants'
import { usePathname } from '@/lib/i18n'
import { cn } from '@penx/utils'
import { useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { toast } from 'sonner'

interface Props extends ButtonProps {
  className?: string
}

export function GoogleOauthButton({
  children,
  className,
  ...rest
}: PropsWithChildren<Props>) {
  const [loading, setLoading] = useState(false)
  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')
  const pathname = usePathname()!

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error
    errorMessage && toast.error(errorMessage)
  }, [error])

  return (
    <Button
      className={cn('w-24 gap-2 rounded-lg text-sm', className)}
      variant="secondary"
      disabled={loading}
      onClick={() => {
        setLoading(true)
        const redirectUri = GOOGLE_OAUTH_REDIRECT_URI

        const parsed = qs.parse(location.search)
        const state = `${location.protocol}//${location.host}__${pathname}__${parsed.ref || ''}`

        const scope = 'openid email profile'
        const googleAuthUrl =
          `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${redirectUri}` +
          `&scope=${scope}&client_id=${GOOGLE_CLIENT_ID}&state=${state}&access_type=offline`
        // &prompt=consent

        location.href = googleAuthUrl
      }}
      {...rest}
    >
      {loading && <LoadingDots className="bg-foreground" />}
      {!loading && (
        <>
          <IconGoogle className="h-4 w-4" />
          <div className="">{children || 'Google login'}</div>
        </>
      )}
    </Button>
  )
}
