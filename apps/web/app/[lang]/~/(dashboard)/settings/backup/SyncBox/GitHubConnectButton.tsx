import { useState } from 'react'
import { toast } from 'sonner'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { updateSiteState } from '@penx/hooks/useQuerySite'
import { api } from '@penx/trpc-client'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'

interface Props {
  installationId: number
  repo: string
}

export function GitHubConnectButton({ installationId, repo }: Props) {
  const [loading, setLoading] = useState(false)

  async function connect() {
    setLoading(true)
    try {
      await api.github.connectRepo.mutate({
        installationId,
        repo,
      })

      updateSiteState({
        installationId,
        repo,
      })
    } catch (error) {
      toast.warning('Connect GitHub failed')
    }
    setLoading(false)
  }

  return (
    <Button size="sm" disabled={loading} onClick={connect}>
      {loading && <LoadingDots />}
      <div>Connect</div>
    </Button>
  )
}
