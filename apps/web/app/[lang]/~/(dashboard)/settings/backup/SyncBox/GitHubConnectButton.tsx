import { useState } from 'react'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Button } from '@penx/uikit/button'
import { updateSiteState } from '@penx/hooks/useSite'
import { api } from '@penx/trpc-client'
import { toast } from 'sonner'

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
