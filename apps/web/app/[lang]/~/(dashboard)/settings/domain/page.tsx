'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Separator } from '@/components/ui/separator'
import { useSite } from '@/hooks/useSite'
import { getSiteCustomDomain } from '@/lib/getSiteDomain'
import { CustomDomainForm } from './CustomDomainForm'
import DeleteDomain from './DeleteDomain'
import { DomainConfiguration } from './DomainConfiguration'
import { SubdomainDomainForm } from './SubdomainDomainForm'
import { SubdomainList } from './SubdomainList'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, site, error } = useSite()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  const customDomain = getSiteCustomDomain(site)
  return (
    <div className="space-y-8">
      <SubdomainDomainForm site={site!} />
      <div>
        <div className="mb-3 mt-2 text-2xl font-bold">Subdomains</div>
        <SubdomainList site={site!} />
      </div>
      <Separator></Separator>
      <CustomDomainForm site={site!} />
      {customDomain && (
        <div>
          <DomainConfiguration domain={customDomain} />
          <DeleteDomain domain={customDomain} />
        </div>
      )}
    </div>
  )
}
