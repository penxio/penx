'use client'

import { GlobeIcon } from 'lucide-react'
import { usePanelCreationContext } from '@penx/components/Creation/PanelCreationProvider'
import { BUILTIN_PAGE_SLUGS, ROOT_DOMAIN } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useDomains } from '@penx/hooks/useDomains'
import { getSiteDomain } from '@penx/libs/getSiteDomain'

export function CreationLink() {
  const creation = usePanelCreationContext()
  const site = useSiteContext()
  const { data = [] } = useDomains()
  const { isSubdomain, domain } = getSiteDomain(data)
  const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain
  let prefix = '/creations'
  if (BUILTIN_PAGE_SLUGS.includes(creation?.slug)) {
    prefix = ''
  }

  return (
    <div className="hidden items-center gap-1 md:flex">
      <a
        href={`${location.protocol}//${host}${prefix}/${creation.slug}`}
        target="_blank"
        className="text-foreground/40 hover:text-foreground/80 flex items-center gap-1 text-sm"
      >
        <GlobeIcon size={14} />
      </a>
    </div>
  )
}
