import { useEffect, useState } from 'react'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Input } from '@penx/uikit/input'
import { trpc } from '@penx/trpc-client'
import { useDebouncedCallback } from 'use-debounce'
import { GithubConnectedBox } from './GitHubConnectedBox'
import { GithubInstallationSelect } from './GitHubInstallationSelect'
import { Repos } from './Repos'

interface Props {
  github: any
}

export function GitIntegration({ github }: Props) {
  const site = useSiteContext()
  const { data: installations, isLoading: isLoadInstallations } =
    trpc.github.appInstallations.useQuery({
      token: github?.token!,
    })

  const [installationId, setInstallationId] = useState('')

  const [q, setQ] = useState<string>('')
  const debouncedSetQ = useDebouncedCallback(async (val) => {
    return setQ(val)
  }, 500)

  useEffect(() => {
    if (installations?.length && !installationId) {
      setInstallationId(installations[0].installationId.toString())
    }
  }, [installations, installationId])

  if (isLoadInstallations) {
    return (
      <div className="flex h-40 items-center justify-center">
        <LoadingDots></LoadingDots>
      </div>
    )
  }

  if (site.repo) {
    return <GithubConnectedBox repo={site.repo} />
  }

  return (
    <div className="mt-2 flex flex-col gap-4">
      <div className="flex justify-between gap-3">
        <GithubInstallationSelect
          token={github?.token!}
          value={(installationId || '').toString()}
          onChange={(v: string) => setInstallationId(v)}
        />
        <Input
          placeholder="Search..."
          onChange={(e) => debouncedSetQ(e.target.value)}
        />
      </div>
      {installationId && (
        <Repos
          token={github?.token!}
          q={q}
          installationId={Number(installationId)}
        />
      )}
    </div>
  )
}
