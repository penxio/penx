'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { toast } from 'sonner'
import { api } from '@penx/api'
import { refreshSession, useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { syncNodesByDiff } from './lib/syncNodesByDiff'

export function EnableSyncServerButton() {
  const { session } = useSession()
  const [loading, setLoading] = useState(false)

  return (
    <Button
      className="min-w-[200px]"
      size="lg"
      disabled={loading}
      onClick={async () => {
        setLoading(true)
        try {
          await api.updateSite({
            id: session.spaceId,
            syncServer: {
              ...session.syncServer,
              enabled: true,
            },
          })
          await refreshSession()
          await syncNodesByDiff(session.spaceId)
          toast.success('Enable successfully')
        } catch (error) {
          toast.error(extractErrorMessage(error))
        }
        setLoading(false)
      }}
    >
      {loading ? (
        <LoadingDots className="bg-background" />
      ) : (
        <Trans>Enable custom sync server</Trans>
      )}
    </Button>
  )
}
