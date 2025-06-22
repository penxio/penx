import { ReactNode, useState } from 'react'
import { impact } from '@/lib/impact'
import { Trans, useLingui } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { useSession } from '@penx/session'
import { cn } from '@penx/utils'

interface ItemProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

export function SyncMenu({ children, className }: ItemProps) {
  const { i18n } = useLingui()
  const { session } = useSession()
  return (
    <>
      <div
        className={cn(
          'flex h-full w-full items-center justify-between',
          className,
        )}
        onClick={async () => {
          impact()
          if (!session) {
            appEmitter.emit('ROUTE_TO_LOGIN')
            return
          }
          appEmitter.emit('ROUTE_TO_SYNC')
        }}
      >
        <div className="font-medium">
          <Trans>Sync now</Trans>
        </div>
        <div>
          <ChevronRightIcon className="text-foreground/50" />
        </div>
      </div>
    </>
  )
}
