'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { toast } from 'sonner'
import { getGoogleUserInfo } from '@penx/libs/getGoogleUserInfo'
import { useRouter } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@penx/uikit/dialog'
import { IconGoogle } from '@penx/uikit/IconGoogle'
import LoadingCircle from '@penx/uikit/loading-circle'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { useGoogleOauthDialog } from './useGoogleOauthDialog'

export function GoogleOauthDialog() {
  const { isOpen, setIsOpen } = useGoogleOauthDialog()
  const searchParams = useSearchParams()
  const authType = searchParams?.get('auth_type')
  const { login } = useSession()
  const { push } = useRouter()

  const loginWithGoogle = useCallback(
    async function () {
      const accessToken = searchParams?.get('access_token')!
      const id_token = searchParams?.get('id_token')!
      const userId = searchParams?.get('userId')!
      const qsData = searchParams?.get('qs') as string
      const qsObject = JSON.parse(decodeURIComponent(qsData))

      try {
        if (authType === 'google') {
          await login({
            type: 'penx-google',
            accessToken: accessToken,
            userId: userId,
            ref: qsObject?.ref || '',
          })
        }

        if (authType === 'apple') {
          await login({
            type: 'penx-apple',
            accessToken: id_token,
            userId: userId,
            ref: qsObject?.ref || '',
            clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
          })
        }

        // push('/~')
        location.href = `${location.origin}/${location.pathname}?${qs.stringify(qsObject)}`
      } catch (error) {
        toast.error('Failed to sign in with Google. Please try again.')
      }
    },
    [searchParams, login, authType],
  )

  useEffect(() => {
    if (['google', 'apple'].includes(authType || '') && !isOpen) {
      setIsOpen(true)
      loginWithGoogle()
    }
  }, [authType, isOpen, setIsOpen, searchParams, loginWithGoogle])

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogTitle className="hidden">
        <DialogDescription></DialogDescription>
      </DialogTitle>
      <DialogContent
        closable={false}
        className="flex h-64 w-[90%] items-center justify-center rounded-xl focus-visible:outline-none sm:max-w-[425px]"
      >
        {authType === 'google' ? (
          <IconGoogle className="h-6 w-6" />
        ) : (
          <span className="icon-[ic--baseline-apple] size-6"></span>
        )}

        <div className="text-lg">Logging in</div>
        <LoadingDots className="bg-foreground/60" />
      </DialogContent>
    </Dialog>
  )
}
