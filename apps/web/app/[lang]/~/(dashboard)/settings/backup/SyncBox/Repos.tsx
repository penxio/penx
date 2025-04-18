import { LoadingDots } from '@/components/icons/loading-dots'
import { Card } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'
import { LockKeyhole } from 'lucide-react'
import { GitHubConnectButton } from './GitHubConnectButton'

interface Props {
  token: string
  q: string
  installationId: number
}

export function Repos({ installationId, q, token }: Props) {
  const {
    data = [],
    isLoading,
    isFetching,
  } = trpc.github.searchRepo.useQuery({
    q,
    installationId: Number(installationId),
    token,
  })

  if (isLoading) {
    return (
      <Card className="flex h-96 items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <div className="text-foreground/60">Loading repos</div>
          <LoadingDots className="bg-foreground" />
        </div>
      </Card>
    )
  }

  if (!data?.length) {
    return <Card className="flex h-96 items-center">No repos found</Card>
  }

  return (
    <div className="border-foreground/10 mt-2 flex flex-col gap-2 rounded-xl border">
      {data.map((item) => (
        <div
          key={item.id}
          className="border-foreground/10 flex items-center justify-between border-b px-4 py-3"
        >
          <div className="flex items-center gap-1">
            <div>{item.name}</div>
            {item.private && (
              <div className="text-foreground/60">
                <LockKeyhole size={16} />
              </div>
            )}
          </div>
          <GitHubConnectButton
            installationId={installationId}
            repo={item.full_name}
          />
        </div>
      ))}
    </div>
  )
}
