'use client'

import { ExternalLink } from 'lucide-react'
import { ROOT_DOMAIN } from '@penx/constants'
import { useDomainStatus } from '@penx/hooks/use-domain-status'
import { useDomains } from '@penx/hooks/useDomains'
import { useMySpace } from '@penx/hooks/useMySpace'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { Badge } from '@penx/uikit/badge'
import LoadingCircle from '@penx/uikit/loading-circle'
import { LoadingDots } from '@penx/uikit/loading-dots'

export function SiteLink() {
  const { data = [] } = useDomains()
  const { isSubdomain, domain, subdomain } = getSiteDomain(data)
  const link = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain

  if (isSubdomain) {
    return <SiteLinkContent link={link!} />
  }

  return <CustomDomainSiteLink customDomain={domain!} subdomain={subdomain!} />
}

interface SiteLinkContentProps {
  link: string
}

function SiteLinkContent({ link }: SiteLinkContentProps) {
  return (
    <a
      href={`${location.protocol}//${link}`}
      target="_blank"
      className="inline-flex"
    >
      <Badge variant="secondary" className="space-x-2">
        <span>{link}</span>
        <ExternalLink size={16} className="text-foreground/50" />
      </Badge>
    </a>
  )
}

interface CustomDomainSiteLinkProps {
  subdomain: string
  customDomain: string
}

function CustomDomainSiteLink({
  subdomain,
  customDomain,
}: CustomDomainSiteLinkProps) {
  const { status, loading } = useDomainStatus({
    domain: customDomain,
    refreshInterval: 0,
  })

  if (loading) return <LoadingCircle />
  if (status === 'Valid configuration') {
    const link = `${customDomain}`
    return <SiteLinkContent link={link} />
  }
  const link = `${subdomain}.${ROOT_DOMAIN}`
  return <SiteLinkContent link={link} />
}
