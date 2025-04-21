'use client'

import React from 'react'
import { Trans } from '@lingui/react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useSession } from '@penx/session'
import { trpc } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'

export function CliLogin() {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token') as string
  const { data } = useSession()

  const { isPending: isCanceling, mutateAsync: cancel } =
    trpc.cli.cancelLogin.useMutation()

  const { isPending: isConfirming, mutateAsync: confirm } =
    trpc.cli.confirmLogin.useMutation()

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-center p-10">
      <div className="text-3xl font-bold">
        <Trans id="Login to PenX CLI"></Trans>
      </div>
      <div className="text-foreground/500">
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
          w-160
          disabled={isConfirming}
          onClick={async () => {
            try {
              await confirm({ token })
              toast.success(<Trans id="CLI login successfully"></Trans>)
              location.href = '/'
            } catch (error) {
              toast.error(<Trans id="Please try again~"></Trans>)
            }
          }}
        >
          {isConfirming && <LoadingDots></LoadingDots>}
          <div>
            <Trans id="Authorize CLI login"></Trans>
          </div>
        </Button>
      </div>
    </div>
  )
}
