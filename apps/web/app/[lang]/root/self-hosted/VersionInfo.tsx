'use client'

import { Skeleton } from '@penx/uikit/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@penx/uikit/ui/tooltip'
import { compareVersions } from '@/lib/compareVersions'
import { trpc } from '@penx/trpc-client'
import { HostedSite } from '@prisma/client'
import { ArrowUp } from 'lucide-react'

export function VersionInfo({ site }: { site: HostedSite }) {
  const { data: penxVersion = '', isLoading } =
    trpc.hostedSite.penxVersion.useQuery()

  if (isLoading) {
    return <Skeleton className="h-4 w-20" />
  }

  const upgradable = compareVersions(site.version || '0.0.1', penxVersion) < 0

  return (
    <div className="flex h-4 items-center justify-center gap-1">
      <div className="text-xs opacity-40">v{site.version || '0.0.1'}</div>
      {upgradable && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="gap1 flex items-center">
              <ArrowUp
                size={12}
                className="cursor-pointer rounded-full bg-green-500 text-white"
              />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                v{penxVersion} is available. Click redeploy to upgrade.
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {!upgradable && <span className="text-xs opacity-40">(newest)</span>}
    </div>
  )
}
