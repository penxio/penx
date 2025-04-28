'use client'

import React from 'react'
import { Trans } from '@lingui/react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useSession } from '@penx/session'
import { trpc } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Button } from '@penx/uikit/button'
import { useLoginDialog } from '@penx/widgets/LoginDialog/useLoginDialog'

export function DesktopLogin() {
  const { setIsOpen } = useLoginDialog()
  const { session, isLoading } = useSession()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token') as string
  const { data } = useSession()

  const { isPending: isCanceling, mutateAsync: cancel } =
    trpc.desktop.cancelLogin.useMutation()
  const { isPending: isConfirming, mutateAsync: confirm } =
    trpc.desktop.confirmLogin.useMutation()

  if (isLoading) {
    return (
      <div className="bg-background flex h-screen flex-col items-center justify-center p-10">
        <LoadingDots className="bg-foreground" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="bg-background flex h-screen flex-col items-center justify-center p-10">
        <div className="mt-6 flex items-center justify-between gap-2">
          <Button
            size="lg"
            className="w-32"
            onClick={async () => {
              setIsOpen(true)
            }}
          >
            <Trans id="Sign in"></Trans>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-center p-10">
      <div className="text-3xl font-bold">
        <Trans id="Login to PenX desktop"></Trans>
      </div>
      <div className="text-foreground/50">
        <Trans id="Please confirm your authorization for this login."></Trans>
      </div>

      <div className="mt-6 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          className="w-[160px] gap-2"
          disabled={isCanceling}
          onClick={async () => {
            if (isCanceling) return
            try {
              await cancel({ token })
              window.close()
            } catch (error) {
              toast.error('please try again')
            }
          }}
        >
          {isCanceling && <LoadingDots></LoadingDots>}
          <div>
            <Trans id="Cancel"></Trans>
          </div>
        </Button>
        <Button
          disabled={isConfirming}
          onClick={async () => {
            try {
              await confirm({ token })
              fetch('http://localhost:14158/open-window')
              toast.success(<Trans id="Desktop login successfully"></Trans>)
              location.href = '/'
            } catch (error) {
              toast.error(<Trans id="Please try again~"></Trans>)
            }
          }}
        >
          {isConfirming && <LoadingDots></LoadingDots>}
          <div>
            <Trans id="Authorize desktop login"></Trans>
          </div>
        </Button>
      </div>
    </div>
  )
}
