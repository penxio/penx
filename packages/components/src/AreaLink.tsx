'use client'

import { GlobeIcon } from 'lucide-react'
import { useAreaContext } from '@penx/components/AreaContext'
import { ROOT_DOMAIN } from '@penx/constants'
import { useDomains } from '@penx/hooks/useDomains'
import { useMySite } from '@penx/hooks/useMySite'
import { getSiteDomain } from '@penx/libs/getSiteDomain'

interface Props {
  className?: string
}

export function AreaLink({ className }: Props) {
  const area = useAreaContext()
  const { site } = useMySite()
  const { data = [] } = useDomains()
  const { isSubdomain, domain } = getSiteDomain(data as any)
  const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain
  return (
    <a
      href={`${location.protocol}//${host}/areas/${area.slug}`}
      rel="noreferrer"
      target="_blank"
      className="text-foreground/60 hover:text-foreground inline-flex cursor-pointer"
    >
      <GlobeIcon size={20} />
    </a>
  )
}
