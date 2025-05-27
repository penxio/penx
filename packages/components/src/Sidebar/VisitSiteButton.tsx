'use client'

import { Trans } from '@lingui/react/macro'
import { ExternalLink, GlobeIcon, LinkIcon } from 'lucide-react'
import { ROOT_DOMAIN } from '@penx/constants'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { Button } from '@penx/uikit/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@penx/uikit/tooltip'

interface Props {}

export function VisitSiteButton({}: Props) {
  // const { data = [] } = useDomains()
  // const { domain, isSubdomain } = getSiteDomain(data)
  // const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain

  // return (
  //   <TooltipProvider>
  //     <Tooltip>
  //       <TooltipTrigger asChild>
  //         <Button
  //           variant="ghost"
  //           size="icon"
  //           className="hover:bg-foreground/8 size-8"
  //           onClick={() => {
  //             window.open(`${location.protocol}//${host}`)
  //           }}
  //         >
  //           <GlobeIcon size={16} />
  //         </Button>
  //       </TooltipTrigger>
  //       <TooltipContent>
  //         <Trans>Visit my site</Trans>
  //       </TooltipContent>
  //     </Tooltip>
  //   </TooltipProvider>
  // )
  return null
}
