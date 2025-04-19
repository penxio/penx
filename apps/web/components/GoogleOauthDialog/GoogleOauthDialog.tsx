'use client'

import { useCallback, useEffect, useState } from 'react'
import { IconGoogle } from '@/components/icons/IconGoogle'
import LoadingCircle from '@/components/icons/loading-circle'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useSession } from '@/components/session'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@penx/uikit/ui/dialog'
import { getGoogleUserInfo } from '@/lib/getGoogleUserInfo'
import { useRouter } from '@/lib/i18n'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
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
      const ref = searchParams?.get('ref') as string
      try {
        const info = await getGoogleUserInfo(accessToken)

        const result = await login({
          type: 'penx-google',
          email: info.email,
          openid: info.sub,
          picture: info.picture,
          name: info.name,
          ref: ref,
        })

        push('/~')
      } catch (error) {
        toast.error('Failed to sign in with Google. Please try again.')
      }

      console.log(
        '=====`${location.origin}/${location.pathname}`:',
        `${location.origin}/${location.pathname}`,
      )

      location.href = `${location.origin}/${location.pathname}`
    },
    [searchParams, login],
  )

  useEffect(() => {
    if (authType === 'google' && !isOpen) {
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
        <IconGoogle className="h-6 w-6" />
        <div className="text-lg">Logging in</div>
        <LoadingDots className="bg-foreground/60" />
      </DialogContent>
    </Dialog>
  )
}
