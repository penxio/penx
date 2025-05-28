'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { toast } from 'sonner'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_DRIVE_OAUTH_REDIRECT_URI,
  GOOGLE_OAUTH_REDIRECT_URI,
} from '@penx/constants'
import { usePathname } from '@penx/libs/i18n'
import { localDB } from '@penx/local-db'
import { useSession } from '@penx/session'
import { Button, ButtonProps } from '@penx/uikit/button'
import { IconGoogle } from '@penx/uikit/IconGoogle'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { cn } from '@penx/utils'

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
  const token = searchParams

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error
    errorMessage && toast.error(errorMessage)
  }, [error])

  return (
    <Button
      className={cn('w-24 gap-2 rounded-lg text-sm', className)}
      variant="secondary"
      disabled={loading}
      onClick={async () => {
        setLoading(true)
        const sites = await localDB.listAllSites()
        const site = sites.find((s) => !s.props.isRemote)

        const redirectUri = GOOGLE_OAUTH_REDIRECT_URI
        const parsed = qs.parse(location.search) || {}
        const state = `${location.protocol}//${location.host}__${location.pathname}__uid${site?.userId || ''}__${encodeURIComponent(JSON.stringify(parsed))}`

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
          <div className="">{children || <Trans>Google login</Trans>}</div>
        </>
      )}
    </Button>
  )
}
