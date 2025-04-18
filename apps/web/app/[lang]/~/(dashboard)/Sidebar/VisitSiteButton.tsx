'use client'

import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ROOT_DOMAIN } from '@/lib/constants'
import { getSiteDomain } from '@/lib/getSiteDomain'
import { Trans } from '@lingui/react/macro'
import { ExternalLink, GlobeIcon, LinkIcon } from 'lucide-react'

interface Props {}

export function VisitSiteButton({}: Props) {
  const site = useSiteContext()
  const { domain, isSubdomain } = getSiteDomain(site as any)
  const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-foreground/8 size-8"
            onClick={() => {
              window.open(`${location.protocol}//${host}`)
            }}
          >
            <GlobeIcon size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <Trans>Visit my site</Trans>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
