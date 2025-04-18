'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { LoginButton } from '@/components/LoginButton'
import { useSession } from '@/components/session'
import { Button } from '@/components/ui/button'
import { api, trpc } from '@/lib/trpc'
import { Trans } from '@lingui/react/macro'
import { ApiTokenDialog } from './ApiTokenDialog/ApiTokenDialog'
import { useApiTokenDialog } from './ApiTokenDialog/useApiTokenDialog'
import { DeployNewSiteDialog } from './DeployNewSiteDialog/DeployNewSiteDialog'
import { useDeployNewSiteDialog } from './DeployNewSiteDialog/useDeployNewSiteDialog'
import { DeploySiteForm } from './DeploySiteForm'
import { HostedSiteItem } from './HostedSiteItem'

export function SelfHostedPage() {
  const { data, status } = useSession()
  if (status === 'loading') {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-3">
        <h2 className="text-4xl font-bold">
          <Trans>Deploy in 10 minutes</Trans>
        </h2>
        <div className="text-foreground/70 text-base">
          <Trans>Deploy your own site to Cloudflare Pages in 10 minutes.</Trans>
        </div>
        <div className="text-foreground/50 -mt-1 text-sm">
          <Trans>100% run on Cloudflare and deploy freely.</Trans>
        </div>
        <LoginButton size="lg" variant="default">
          <Trans>Sign in to deploy</Trans>
        </LoginButton>
      </div>
    )
  }

  return (
    <>
      <ApiTokenDialog />
      <DeployNewSiteDialog />
      <Content />
    </>
  )
}

function Content() {
  const { setIsOpen } = useDeployNewSiteDialog()
  const { setIsOpen: openApiTokenDialog } = useApiTokenDialog()
  const { isLoading, data = [] } = trpc.hostedSite.myHostedSites.useQuery()

  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="mt-20 space-y-20 pb-20">
        <DeploySiteForm />
      </div>
    )
  }

  return (
    <div className="mx-auto mt-20 max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-3xl font-bold">
            <Trans>My sites</Trans>
          </div>
          <div className="text-sm">
            <Trans>Read the deployment guide</Trans>:{' '}
            <a
              className="text-brand"
              href="https://docs.penx.io/en/creations/deploy-penx-with-one-click-tools"
              target="_blank"
            >
              <Trans>Deploy PenX with One-click tools</Trans>
            </a>
            .
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              openApiTokenDialog(true)
            }}
          >
            <Trans>Update API token</Trans>
          </Button>

          <Button
            size="lg"
            onClick={() => {
              setIsOpen(true)
            }}
          >
            <Trans>Deploy new site</Trans>
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {data.map((site) => (
          <HostedSiteItem key={site.id} site={site} />
        ))}
      </div>
    </div>
  )
}
