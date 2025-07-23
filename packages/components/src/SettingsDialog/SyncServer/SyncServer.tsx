'use client'

import { Trans } from '@lingui/react/macro'
import { toast } from 'sonner'
import { api } from '@penx/api'
import { useMySpace } from '@penx/hooks/useMySpace'
import { useSettings } from '@penx/hooks/useSettings'
import { useSyncServerPassword } from '@penx/hooks/useSyncServerPassword'
import { localDB } from '@penx/local-db'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Badge } from '@penx/uikit/ui/badge'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { EnableSyncServerButton } from './EnableSyncServerButton'
import { syncNodesByDiff } from './lib/syncNodesByDiff'
import { useSyncServerDialog } from './useSyncServerDialog'

export function SyncServer() {
  const { setOpen } = useSyncServerDialog()
  const { data: password = '', isLoading: isPasswordLoading } =
    useSyncServerPassword()
  const { session } = useSession()

  const { data: settings, isLoading } = useSettings()

  if (isLoading || isPasswordLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <div>
          <LoadingDots className="bg-foreground" />
        </div>
      </div>
    )
  }

  const host = session?.syncServer?.host || ''
  const enabled = session?.syncServer?.enabled
  if (!host) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="text-foreground/60">
            <Trans>Sync data using you own server</Trans>
          </div>
          <Button className="" size="lg" onClick={() => setOpen(true)}>
            <Trans>Add sync server</Trans>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <div className="text-foreground/50 text-xs">
            <Trans>Host</Trans>
          </div>
          <div className="text-foreground text-xl">{host}</div>
        </div>
        <div className="space-y-1">
          <div className="text-foreground/50 text-xs">
            <Trans>status</Trans>
          </div>
          {!enabled && (
            <Badge variant="warning">
              <Trans>Not enabled</Trans>
            </Badge>
          )}
          {enabled && (
            <Badge variant="success">
              <Trans>Enabled</Trans>
            </Badge>
          )}
        </div>

        <div className="mt-2">
          {!password && (
            <Button className="" size="lg" onClick={() => setOpen(true)}>
              <Trans>Set password</Trans>
            </Button>
          )}

          {password && <EnableSyncServerButton />}
        </div>
      </div>
    </div>
  )
}
