'use client'

import { DeployStatus } from '@penx/types'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Skeleton } from '@penx/uikit/skeleton'

interface Props {
  isLoading: boolean
  status: DeployStatus | undefined
}

export function HostedSiteStatus({ isLoading, status }: Props) {
  if (isLoading) return <Skeleton className="h-5 w-24" />

  return (
    <div className="text-sm">
      {status === DeployStatus.DEPLOYING && (
        <div className="flex items-center gap-1 leading-none text-yellow-500">
          <span>Deploying</span>
          <div className="">
            <LoadingDots className="bg-yellow-500" />
          </div>
        </div>
      )}
      {status === DeployStatus.DOMAIN_PENDING && (
        <div className="flex items-center text-yellow-500">
          <span>Waiting domain configuration(about 5 minutes)</span>
        </div>
      )}
      {status === DeployStatus.SUCCESS && (
        <div className="flex items-center text-green-500">
          <span>Deploy successfully!</span>
        </div>
      )}
    </div>
  )
}
