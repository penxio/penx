'use client'

import { GlobeIcon } from 'lucide-react'
import { BUILTIN_PAGE_SLUGS, ROOT_DOMAIN } from '@penx/constants'
import { useDomains } from '@penx/hooks/useDomains'
import { useMySite } from '@penx/hooks/useMySite'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { usePanelCreationContext } from '../../Creation'

export function CreationLink() {
  const creation = usePanelCreationContext()
  const { site } = useMySite()
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
