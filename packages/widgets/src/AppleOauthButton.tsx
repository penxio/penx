'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { toast } from 'sonner'
import {
  APPLE_OAUTH_REDIRECT_URI,
  GOOGLE_CLIENT_ID,
  GOOGLE_DRIVE_OAUTH_REDIRECT_URI,
} from '@penx/constants'
import { usePathname } from '@penx/libs/i18n'
import { localDB } from '@penx/local-db'
import { useSession } from '@penx/session'
import { Button, ButtonProps } from '@penx/uikit/button'
import { IconGoogle } from '@penx/uikit/IconGoogle'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'

interface Props extends ButtonProps {
  className?: string
}

export function AppleOauthButton({
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

        const redirectUri = APPLE_OAUTH_REDIRECT_URI

        const parsed = qs.parse(location.search) || {}
        const state = `${location.protocol}//${location.host}__${pathname}__uid${site?.userId || ''}__${encodeURIComponent(JSON.stringify(parsed))}`

        const buildAuthUrl = () => {
          const params = new URLSearchParams({
            response_type: 'code',
            response_mode: 'form_post',
            client_id: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
            redirect_uri: redirectUri,
            scope: 'name email',
            state,
          })
          return `https://appleid.apple.com/auth/authorize?${params}`
        }

        location.href = buildAuthUrl()
      }}
      {...rest}
    >
      {loading && <LoadingDots className="bg-foreground" />}
      {!loading && (
        <>
          <span className="icon-[ic--baseline-apple] size-6"></span>
          <div className="">{children || <Trans>Apple login</Trans>}</div>
        </>
      )}
    </Button>
  )
}
