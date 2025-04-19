'use client'

import React from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSession } from '@/components/session'
import { Button } from '@penx/ui/components/button'
import { trpc } from '@/lib/trpc'
import { Trans } from '@lingui/react/macro'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

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
        <Trans>Login to PenX CLI</Trans>
      </div>
      <div className="text-foreground/500">
        <Trans>Please confirm your authorization for this login.</Trans>
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
            <Trans>Cancel</Trans>
          </div>
        </Button>
        <Button
          w-160
          disabled={isConfirming}
          onClick={async () => {
            try {
              await confirm({ token })
              toast.success(<Trans>CLI login successfully</Trans>)
              location.href = '/'
            } catch (error) {
              toast.error(<Trans>please try again~</Trans>)
            }
          }}
        >
          {isConfirming && <LoadingDots></LoadingDots>}
          <div>
            <Trans>Authorize CLI login</Trans>
          </div>
        </Button>
      </div>
    </div>
  )
}
