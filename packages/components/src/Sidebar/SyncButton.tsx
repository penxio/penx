'use client'

import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { RefreshCcwIcon, ZapIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { usePlanListDialog } from '@penx/components/usePlanListDialog'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn } from '@penx/utils'
import { syncNodesToServer } from '@penx/worker/lib/syncNodesToServer'

const MotionButton = motion.create(Button)

interface Props {}

export function SyncButton({}: Props) {
  const { data: session } = useSession()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={cn('size-8 shrink-0')}>
          <RefreshCcwIcon size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-60">
        <div className="text-foreground flex h-full flex-1 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="space-y-3">
              <div className="flex justify-center text-center text-2xl font-bold">
                <Trans>PenX Sync</Trans>
              </div>
              <div className="text-foreground/60 text-center">
                <Trans>
                  PenX is a Local-first App, supporting offline use and
                  multi-device sync.
                </Trans>
              </div>
            </div>
          </div>
          <MotionButton
            whileTap={{ scale: 1.1 }}
            size="lg"
            onClick={async () => {
              toast.promise(
                async () => {
                  await syncNodesToServer()
                },
                {
                  loading: t`Syncing...`,
                  success: t`Sync successful!`,
                  error: () => {
                    return t`Sync failed, please try again.`
                  },
                },
              )
            }}
          >
            <Trans>Sync now</Trans>
          </MotionButton>
        </div>
      </PopoverContent>
    </Popover>
  )
}
