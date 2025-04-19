import { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@penx/ui/components/button'
import { updateSiteState } from '@/hooks/useSite'
import { api } from '@/lib/trpc'
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
