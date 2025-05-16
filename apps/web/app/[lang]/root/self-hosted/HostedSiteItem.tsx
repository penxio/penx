'use client'

import { useEffect } from 'react'
import { ArrowUp, Check, ExternalLink, X } from 'lucide-react'
import { toast } from 'sonner'
import { HostedSite } from '@penx/db/client'
import { api, trpc } from '@penx/trpc-client'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Separator } from '@penx/uikit/separator'
import { Skeleton } from '@penx/uikit/skeleton'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { HostedSiteStatus } from './HostedSiteStatus'
import { VersionInfo } from './VersionInfo'

export function HostedSiteItem({ site }: { site: HostedSite }) {
  const { isPending, mutateAsync } = trpc.hostedSite.redeploy.useMutation()
  const { refetch } = trpc.hostedSite.myHostedSites.useQuery()
  const { data: accountId = '' } = trpc.hostedSite.cfAccountId.useQuery()

  const redeploy = async () => {
    try {
      const res = await mutateAsync({ id: site.id })
      refetch()
      toast.success('Redeploy task created!')
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div
      key={site.id}
      className="border-foreground/5 bg-background flex justify-between rounded-lg border p-5"
    >
      <div className="">
        <div className="text-lg font-bold">{site.name}</div>
        <PagesProjectInfo site={site}></PagesProjectInfo>
      </div>

      <div className="flex-end flex flex-col justify-between gap-3">
        <div className="relative ml-auto flex flex-col items-center justify-center gap-1">
          <Button
            size="default"
            variant="outline-solid"
            className="w-24"
            disabled={isPending}
            onClick={redeploy}
          >
            {isPending ? (
              <LoadingDots className="bg-foreground/60"></LoadingDots>
            ) : (
              <div className="leading-none">
                <div className="font-semibold">Redeploy</div>
              </div>
            )}
          </Button>
          <VersionInfo site={site} />
        </div>

        {accountId && (
          <a
            href={`https://dash.cloudflare.com/${accountId}/pages/view/penx-${site.id}`}
            target="_blank"
            className="flex gap-1 text-xs"
          >
            <span>Manage on Cloudflare</span>
            <ExternalLink className="text-foreground/50" size={12} />
          </a>
        )}
      </div>
    </div>
  )
}

function PagesProjectInfo({ site }: { site: HostedSite }) {
  const { refetch } = trpc.hostedSite.myHostedSites.useQuery()

  const { data, isLoading } = trpc.hostedSite.siteProjectInfo.useQuery(
    {
      siteId: site.id,
    },
    {
      refetchInterval: 5 * 1000,
    },
  )

  const { isLoading: isStatusLoading, data: status } =
    trpc.hostedSite.getDeployStatus.useQuery(
      { url: data && data.domains[0] ? 'https://' + data.domains[0] : '' },
      {
        refetchInterval: 5 * 1000,
        enabled: !!data,
      },
    )

  useEffect(() => {
    if (!data) return
    api.hostedSite.update
      .mutate({
        siteId: site.id,
        domain: JSON.stringify(data.domains),
      })
      .then(() => {
        // refetch()
      })
  }, [data, site, refetch])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-6 w-64" />
      </div>
    )
  }

  if (typeof data === 'boolean' && data === false) {
    return (
      <div className="flex items-center gap-1 text-yellow-500">
        <div>Deploying, wait for a moment</div>
        <LoadingDots className="bg-yellow-500/60" />
      </div>
    )
  }
  const productionConfig = data?.deployment_configs?.production
  const d1 = productionConfig?.d1_databases
  const kv = productionConfig?.kv_namespaces
  const r2 = productionConfig?.r2_buckets

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-foreground/60">
          {data?.domains.map((domain) => (
            <div key={domain}>
              <a
                href={`https://${domain}`}
                target="_blank"
                className="flex items-center gap-1"
              >
                {domain}
                <ExternalLink size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {d1 && (
          <>
            <div className="flex gap-2">
              <Badge variant="secondary">
                {!d1 && <X size={16} className="mr-1 text-red-500" />}
                {d1 && <Check size={16} className="mr-1 text-green-500" />}
                D1
              </Badge>
              <Badge variant="secondary">
                {!kv && <X size={16} className="mr-1 text-red-500" />}
                {kv && <Check size={16} className="mr-1 text-green-500" />}
                KV
              </Badge>
              <Badge variant="secondary">
                {!r2 && <X size={16} className="mr-1 text-red-500" />}
                {r2 && <Check size={16} className="mr-1 text-green-500" />}
                R2
              </Badge>
            </div>

            <Separator orientation="vertical" className="h-5" />
          </>
        )}

        <HostedSiteStatus isLoading={isStatusLoading} status={status} />
      </div>
    </div>
  )
}
