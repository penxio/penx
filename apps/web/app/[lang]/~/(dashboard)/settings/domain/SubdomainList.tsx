'use client'

import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'
import { ROOT_DOMAIN } from '@penx/constants'
import { SiteWithDomains } from '@penx/libs/getSiteDomain'
import { trpc } from '@penx/trpc-client'
import { Domain, SubdomainType } from '@prisma/client'

interface Props {
  site: SiteWithDomains
}

export function SubdomainList({ site }: Props) {
  const { data = [], isLoading } = trpc.site.listSiteSubdomains.useQuery({
    siteId: site.id,
  })

  if (isLoading) return <div></div>
  return (
    <div className="grid gap-[2px]">
      {data.map((item) => (
        <DomainItem key={item.id} domain={item} site={site} />
      ))}
    </div>
  )
}

interface DomainItemProps {
  site: SiteWithDomains
  domain: Domain
}
function DomainItem({ domain, site }: DomainItemProps) {
  const { refetch } = trpc.site.listSiteSubdomains.useQuery({
    siteId: site.id,
  })

  const { isPending, mutateAsync } = trpc.site.deleteSubdomain.useMutation()
  return (
    <div className="flex items-center justify-between">
      <div>
        {domain.domain}.{ROOT_DOMAIN}
      </div>
      <Button
        variant="destructive"
        size="sm"
        className="w-16"
        disabled={isPending || domain.subdomainType !== SubdomainType.Custom}
        onClick={async () => {
          await mutateAsync({ siteId: domain.id, domainId: domain.id })
          await refetch()
        }}
      >
        {isPending ? <LoadingDots className="bg-white" /> : 'Delete'}
      </Button>
    </div>
  )
}
