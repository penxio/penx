'use client'

import { ExternalLink } from 'lucide-react'
import { ROOT_DOMAIN } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useDomainStatus } from '@penx/hooks/use-domain-status'
import { useDomains } from '@penx/hooks/useDomains'
import { useSite } from '@penx/hooks/useSite'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import LoadingCircle from '@penx/uikit/components/icons/loading-circle'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Badge } from '@penx/uikit/ui/badge'

export function SiteLink() {
  const site = useSiteContext()
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
