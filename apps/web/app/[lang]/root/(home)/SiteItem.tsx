'use client'

import { useMemo } from 'react'
import { isServer, ROOT_DOMAIN } from '@penx/constants'
import { useDomains } from '@penx/hooks/useDomains'
import { getSiteDomain, SiteWithDomains } from '@penx/libs/getSiteDomain'
import { Link } from '@penx/libs/i18n'
import { MySite } from '@penx/types'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/ui/avatar'
import { cn, getUrl } from '@penx/utils'

interface Props {
  site: MySite
}

export function SiteItem({ site }: Props) {
  const { domain, isSubdomain } = getSiteDomain(site.domains)
  const link = useMemo(() => {
    if (isServer) return ''
    return isSubdomain
      ? `${location.protocol}//${domain}.${ROOT_DOMAIN}`
      : `${location.protocol}//${domain}`
  }, [domain, isSubdomain])

  return (
    <Link
      key={site.id}
      href={link}
      isSite
      target="_blank"
      className={cn(
        'bg-background/30 dark:bg-foreground/5 border-foreground/7 flex cursor-pointer items-center justify-between gap-3 border p-5 transition-all hover:scale-105',
        // spaces.length !== index + 1 && 'border-b border-neutral-100/90',
      )}
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-12 w-12 rounded-lg">
          <AvatarImage src={getUrl(site.logo || '')} />
          <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
        </Avatar>

        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <div className="mr-3 text-xl font-semibold">{site.name}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-foreground/60 text-xs">{site.description}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
