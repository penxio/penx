import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useSiteContext } from '@/components/SiteContext'
import { Github } from '@/components/theme-ui/SocialIcon/icons'
import { Button } from '@/components/ui/button'
import { updateSiteState } from '@/hooks/useSite'
import { queryClient } from '@/lib/queryClient'
import { api } from '@/lib/trpc'
import { ExternalLink } from 'lucide-react'

interface Props {
  repo: string
}

export function GithubConnectedBox({ repo }: Props) {
  const site = useSiteContext()
  return (
    <div className="border-foreground/10 flex items-center justify-between rounded-xl border p-4">
      <div className="flex items-center gap-2">
        <Github className="h-6 w-6" />
        <div className="text-base">{repo}</div>
        <a href={`https://github.com/${repo}`} target="_blank">
          <ExternalLink size={16} />
        </a>
      </div>
      <ConfirmDialog
        title="Sure to disconnect?"
        content="Are you sure you want to disconnect?"
        onConfirm={async () => {
          await api.github.disconnectRepo.mutate()

          updateSiteState({
            installationId: null,
            repo: '',
          })
        }}
      >
        <Button variant="outline">Disconnect</Button>
      </ConfirmDialog>
    </div>
  )
}
