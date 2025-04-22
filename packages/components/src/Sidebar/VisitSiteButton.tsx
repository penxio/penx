'use client'

import { Trans } from '@lingui/react'
import { ExternalLink, GlobeIcon, LinkIcon } from 'lucide-react'
import { ROOT_DOMAIN } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useDomains } from '@penx/hooks/useDomains'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { Button } from '@penx/uikit/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@penx/uikit/ui/tooltip'

interface Props {}

export function VisitSiteButton({}: Props) {
  const site = useSiteContext()
  const { data = [] } = useDomains()
  const { domain, isSubdomain } = getSiteDomain(data)
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
          <Trans id="Visit my site"></Trans>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
