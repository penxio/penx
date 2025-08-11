import { useState } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@penx/api'
import { appEmitter } from '@penx/emitter'
import { useCopyToClipboard } from '@penx/hooks/useCopyToClipboard'
import { refreshSession, useSession } from '@penx/session'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'
import { Input } from '@penx/uikit/ui/input'
import { cn } from '@penx/utils'

interface Props {
  className?: string
}
export function EarlyAccessCode({ className }: Props) {
  const { session, refetch } = useSession()
  const [value, setValue] = useState('')
  const { copy } = useCopyToClipboard()
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['validate-early-access-code'],
    mutationFn: async (code: string) => api.isEarlyAccessCodeValid(code),
  })
  async function confirm() {
    try {
      const valid = await mutateAsync(value)
      if (valid) {
        await refreshSession()
        appEmitter.emit('APP_LOGIN_SUCCESS', session)
      } else {
        toast.error(t`Invalid early access code!`)
      }
    } catch (error) {
      toast.error(t`Invalid early access code!`)
    }
  }
  return (
    <div
      className={cn(
        'drag bg-background/80 flex h-screen w-full items-center justify-center',
        className,
      )}
    >
      <div className="no-drag -mt-[10vh] flex w-[520px] flex-col items-center gap-3">
        <div className="text-foreground no-drag text-xl font-bold">
          <Trans>Early Access Code</Trans>
        </div>
        <div className="text-foreground/60 text-center">
          <div>
            Penx is currently in the early stage. Join{' '}
            <a
              className="text-brand font-bold"
              target="_blank"
              href="https://discord.gg/nyVpH9njDu"
            >
              Discord
            </a>{' '}
            to get an early access code. To get the code, in{' '}
            <span className="text-foreground font-bold">early-access-code</span>{' '}
            channel to enter:{' '}
          </div>

          <div className="mt-2 flex items-center justify-center gap-1">
            <div className="text-foreground bg-foreground/10 inline-flex rounded-full px-4 py-1.5">
              /code
            </div>

            <div className="text-foreground bg-foreground/10 inline-flex rounded-full px-4 py-1.5">
              {session?.email}
            </div>
          </div>
        </div>
        <Input
          size="xl"
          placeholder={t`Early access code`}
          className="no-drag dark:border-foreground/80 mt-3 w-full text-center"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value) {
              confirm()
            }
          }}
        />
        <Button
          size="xl"
          className="no-drag mt-2 w-full gap-1"
          disabled={!value || isPending}
          onClick={confirm}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value && !isPending) {
              confirm()
            }
          }}
        >
          <Trans>Join PenX</Trans>
          {isPending && <LoadingDots className="bg-background" />}
        </Button>
      </div>
    </div>
  )
}
