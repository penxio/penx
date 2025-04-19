'use client'

import { useDomainStatus } from '@/app/[lang]/~/(dashboard)/settings/domain/use-domain-status'
import { Badge } from '@penx/ui/components/badge'
import { useSite } from '@/hooks/useSite'
import { ROOT_DOMAIN } from '@/lib/constants'
import { getSiteDomain } from '@/lib/getSiteDomain'
import { ExternalLink } from 'lucide-react'
import LoadingCircle from './icons/loading-circle'
import { useSiteContext } from './SiteContext'

export function SiteLink() {
  const site = useSiteContext()

  const { isSubdomain, domain, subdomain } = getSiteDomain(site as any)
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
